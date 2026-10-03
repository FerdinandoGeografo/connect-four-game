import { computed, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, interval, map, Subject, switchMap, timer } from 'rxjs';
import { GameMode, GamePhase, RoundEnd } from '../models/game.model';
import {
  Board,
  BOARD_ROWS,
  BOARD_COLUMNS,
  CellData,
  CellPosition,
  createEmptyBoard,
  TURN_DURATION_SECONDS,
  WinCells,
} from '../models/board.model';
import { GamePlayers, PlayerCode, ScorePlayers, getPlayersByMode } from '../models/player.model';
import {
  chooseCpuColumn,
  findWin,
  getOpponent,
  getPlayableColumns,
  isBoardFull,
  placeDisc,
} from '../utils/connect-four';

const CPU_THINK_MIN_MS = 1250;
const CPU_THINK_MAX_MS = 2500;

@Injectable({
  providedIn: 'root',
})
export class GameStore {
  private readonly state = signal<GameState>(initialState);

  readonly mode = computed(() => this.state().mode);
  readonly phase = computed(() => this.state().phase);
  readonly players = computed(() => this.state().players);
  readonly board = computed(() => this.state().board);
  readonly currentPlayerCode = computed(() => this.state().currentPlayer);
  readonly currentPlayer = computed(() => this.players()[this.currentPlayerCode()]);
  readonly currentOpponentCode = computed(() => getOpponent(this.currentPlayerCode()));
  readonly scores = computed(() => this.state().scores);
  readonly winnerCode = computed(() => this.state().winner);
  readonly winner = computed(() => {
    const winnerCode = this.winnerCode();
    if (!winnerCode) return null;
    return this.players()[winnerCode];
  });
  readonly secondsLeft = computed(() => this.state().secondsLeft);

  readonly isRoundOver = computed(() => this.phase() === 'round-over');
  readonly isCpuTurn = computed(() => this.currentPlayer().type === 'cpu');
  /** True when the local player may drop a disc right now. */
  readonly canPlay = computed(() => this.phase() === 'running' && !this.isCpuTurn());
  readonly playableColumns = computed(() => getPlayableColumns(this.board()));
  readonly winningCells = computed(() => this.state().winningCells);
  readonly cells = computed<CellData[]>(() => {
    const board = this.board();
    const players = this.players();
    const result: CellData[] = [];

    for (let row = 0; row < BOARD_ROWS; row++) {
      for (let col = 0; col < BOARD_COLUMNS; col++) {
        const cell = board[row][col];
        if (cell === null) continue;

        result.push({
          id: `${row}-${col}`,
          position: {
            row,
            column: col,
          },
          player: cell,
          theme: players[cell].theme,
        });
      }
    }
    return result;
  });

  /**
   * Text for the polite live region: it changes only on moves, turn changes,
   * pause and round end, never on timer ticks.
   */
  readonly statusMessage = computed(() => {
    const { phase, players, lastMove, roundEnd } = this.state();
    const current = this.currentPlayer();

    switch (phase) {
      case 'idle':
        return '';
      case 'paused':
        return 'Game paused.';
      case 'round-over': {
        const winner = this.winner();
        if (!winner) return 'The board is full. Draw.';
        const result = `${winner.label} ${winner.winVerb}`;
        return roundEnd === 'timeout' ? `Time's up. ${result}.` : `${result} with four in a row.`;
      }
      case 'running': {
        if (!lastMove) return `${current.turnLabel}.`;
        const mover = players[lastMove.player];
        return `${mover.label} dropped a disc in column ${lastMove.position.column + 1}. ${current.turnLabel}.`;
      }
    }
  });

  private readonly cpuMove$ = new Subject<void>();
  private readonly turnTimer$ = new Subject<void>();

  constructor() {
    // Restart the 1s interval at the start of every turn so each turn gets full seconds.
    this.turnTimer$
      .pipe(
        switchMap(() => interval(1000)),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.handleTick());

    this.cpuMove$
      .pipe(
        switchMap(() => {
          const board = this.board();
          const column = chooseCpuColumn(board, this.currentPlayerCode());
          if (column === null) return EMPTY;

          const thinkMs = CPU_THINK_MIN_MS + Math.random() * (CPU_THINK_MAX_MS - CPU_THINK_MIN_MS);
          return timer(thinkMs).pipe(map(() => ({ board, column })));
        }),
        takeUntilDestroyed(),
      )
      .subscribe(({ board, column }) => {
        // Pause, restart or quit may have happened while the CPU was "thinking".
        if (this.phase() !== 'running' || !this.isCpuTurn() || this.board() !== board) return;
        this.applyDrop(column);
      });
  }

  startGame(mode: GameMode) {
    this.patchState({
      ...initialState,
      mode,
      phase: 'running',
      players: getPlayersByMode(mode),
    });
    this.startTurn();
  }

  restartGame() {
    if (this.phase() === 'idle') return;
    this.startGame(this.mode());
  }

  startRound() {
    if (this.phase() !== 'round-over') return;

    // The starter of the previous round goes second in the next one.
    const startingPlayer = getOpponent(this.state().startingPlayer);
    this.patchState({
      phase: 'running',
      board: createEmptyBoard(),
      currentPlayer: startingPlayer,
      startingPlayer,
      winner: null,
      winningCells: null,
      roundEnd: null,
      lastMove: null,
      secondsLeft: TURN_DURATION_SECONDS,
    });
    this.startTurn();
  }

  pauseGame() {
    if (this.phase() !== 'running') return;
    this.patchState({ phase: 'paused' });
  }

  resumeGame() {
    if (this.phase() !== 'paused') return;
    this.patchState({ phase: 'running' });
    this.startTurn();
  }

  destroyGame() {
    this.patchState({ ...initialState });
  }

  dropDisc(column: number) {
    if (!this.canPlay()) return;
    if (!this.playableColumns().includes(column)) return;

    this.applyDrop(column);
  }

  private applyDrop(column: number) {
    const player = this.currentPlayerCode();
    const placement = placeDisc(this.board(), column, player);
    if (!placement) return;

    const { board, position } = placement;
    const lastMove = { player, position };

    const win = findWin(board, position, player);
    if (win) {
      this.patchState({
        board,
        lastMove,
        phase: 'round-over',
        roundEnd: 'connect',
        winner: player,
        winningCells: win,
        scores: this.incrementScore(player),
      });
      return;
    }

    if (isBoardFull(board)) {
      this.patchState({
        board,
        lastMove,
        phase: 'round-over',
        roundEnd: 'draw',
        winner: null,
        winningCells: null,
      });
      return;
    }

    this.patchState({
      board,
      lastMove,
      currentPlayer: getOpponent(player),
      secondsLeft: TURN_DURATION_SECONDS,
    });
    this.startTurn();
  }

  private handleTick() {
    if (this.phase() !== 'running') return;

    const next = this.secondsLeft() - 1;
    if (next <= 0) {
      const winner = this.currentOpponentCode();
      this.patchState({
        secondsLeft: 0,
        phase: 'round-over',
        roundEnd: 'timeout',
        winner,
        scores: this.incrementScore(winner),
      });
      return;
    }

    this.patchState({ secondsLeft: next });
  }

  private incrementScore(winnerCode: PlayerCode) {
    return {
      ...this.scores(),
      [winnerCode]: this.scores()[winnerCode] + 1,
    };
  }

  private startTurn() {
    this.turnTimer$.next();
    if (this.isCpuTurn()) this.cpuMove$.next();
  }

  private patchState(patch: Partial<GameState>) {
    this.state.update((s) => ({ ...s, ...patch }));
  }
}

interface GameState {
  mode: GameMode;
  phase: GamePhase;
  players: GamePlayers;
  board: Board;
  currentPlayer: PlayerCode;
  startingPlayer: PlayerCode;
  scores: ScorePlayers;
  winner: PlayerCode | null;
  winningCells: WinCells | null;
  roundEnd: RoundEnd | null;
  lastMove: { player: PlayerCode; position: CellPosition } | null;
  secondsLeft: number;
}

const initialState: GameState = {
  mode: 'pvp',
  phase: 'idle',
  players: getPlayersByMode('pvp'),
  board: createEmptyBoard(),
  currentPlayer: 'first',
  startingPlayer: 'first',
  scores: {
    first: 0,
    second: 0,
  },
  winner: null,
  winningCells: null,
  roundEnd: null,
  lastMove: null,
  secondsLeft: TURN_DURATION_SECONDS,
};
