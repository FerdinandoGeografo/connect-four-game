import { computed, effect, Injectable, signal } from '@angular/core';
import { GameMode, GamePhase } from '../models/game.model';
import {
  Board,
  BOARD_COLUMNS,
  BOARD_ROWS,
  CellData,
  CellPosition,
  CONNECT_LENGTH,
  createEmptyBoard,
  findLandingRow,
  TURN_DURATION_SECONDS,
  WIN_DIRECTIONS,
  WinCells,
} from '../models/board.model';
import { GamePlayers, PlayerCode, ScorePlayers, getPlayersByMode } from '../models/player.model';
import { delay, exhaustMap, filter, interval, of, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  readonly currentOpponentCode = computed(() =>
    this.currentPlayerCode() === 'first' ? 'second' : 'first',
  );
  readonly scores = computed(() => this.state().scores);
  readonly winner = computed(() => {
    const winnerCode = this.state().winner;
    if (!winnerCode) return null;
    return this.players()[winnerCode];
  });
  readonly secondsLeft = computed(() => this.state().secondsLeft);

  readonly isRoundOver = computed(() => this.phase() === 'round-over');
  readonly isCpuTurn = computed(() => this.currentPlayer().type === 'cpu');
  readonly playableColumns = computed(() => {
    const board = this.board();

    return Array.from({ length: BOARD_COLUMNS }, (_, column) => column).filter(
      (column) => board[0][column] === null,
    );
  });
  readonly bannerThemeVar = computed(() => {
    const winner = this.winner();
    if (!winner) return 'var(--primary-800)';
    return winner.theme;
  });
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
          theme: players[cell].theme,
        });
      }
    }
    return result;
  });

  private readonly cpuMove$ = new Subject<void>();

  constructor() {
    //effect(() => console.log('[GAME] :\t', this.state()));
    effect(() => {
      console.log('Board Changed: ', this.board());
    });

    interval(1000)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.handleTick());

    this.cpuMove$
      .pipe(
        filter(() => this.phase() === 'running' && this.isCpuTurn()),
        exhaustMap(() => {
          const column = this.chooseCpuColumn();
          const thinkMs = 700 + Math.random() * (1500 - 700);
          console.log('Column chosen: ', column);
          return of(column).pipe(delay(thinkMs));
        }),
        takeUntilDestroyed(),
      )
      .subscribe((column) => this.applyDrop(column));
  }

  startGame(mode: GameMode) {
    this.patchState({
      mode,
      phase: 'running',
      players: getPlayersByMode(mode),
      board: createEmptyBoard(),
      currentPlayer: 'first',
      scores: { first: 0, second: 0 },
      winner: null,
      winningCells: null,
      secondsLeft: TURN_DURATION_SECONDS,
    });
    this.triggerCpuIfNeeded();
  }

  restartGame() {
    this.startGame(this.mode());
  }

  startRound() {
    this.patchState({
      phase: 'running',
      board: createEmptyBoard(),
      currentPlayer: this.currentOpponentCode(),
      secondsLeft: TURN_DURATION_SECONDS,
      winner: null,
      winningCells: null,
    });
    this.triggerCpuIfNeeded();
  }

  pauseGame() {
    if (this.phase() !== 'running') return;
    this.patchState({ phase: 'paused' });
  }

  resumeGame() {
    if (this.phase() !== 'paused') return;
    this.patchState({ phase: 'running' });
    this.triggerCpuIfNeeded();
  }

  destroyGame() {
    this.patchState({ ...initialState });
  }

  dropDisc(column: number) {
    if (this.phase() !== 'running') return;
    if (this.isCpuTurn()) return;
    if (!this.playableColumns().includes(column)) return;

    this.applyDrop(column);
  }

  private applyDrop(column: number) {
    const landingRow = findLandingRow(this.board(), column);
    if (landingRow === -1) return;

    const newBoard = this.board().map((boardRow, rowIndex) =>
      rowIndex !== landingRow
        ? boardRow
        : boardRow.map((cell, colIndex) => (colIndex === column ? this.currentPlayerCode() : cell)),
    );

    const win = this.checkWin(newBoard, landingRow, column, this.currentPlayerCode());
    if (win) {
      this.patchState({
        board: newBoard,
        phase: 'round-over',
        winner: this.currentPlayerCode(),
        winningCells: win,
        scores: this.incrementScore(this.currentPlayerCode()),
      });
      return;
    }

    const isDraw = newBoard[0].every((cell) => cell !== null);
    if (isDraw) {
      this.patchState({
        board: newBoard,
        phase: 'round-over',
        winner: null,
        winningCells: null,
      });
      return;
    }

    this.patchState({
      board: newBoard,
      currentPlayer: this.currentOpponentCode(),
      secondsLeft: TURN_DURATION_SECONDS,
    });
    this.triggerCpuIfNeeded();
  }

  private chooseCpuColumn() {
    const playableColumns = this.playableColumns();
    const cpuCode = this.currentPlayerCode();
    const opponentCode = this.currentOpponentCode();

    const winning = playableColumns.find((col) => this.simulateWin(col, cpuCode));
    if (winning !== undefined) return winning;

    const blocking = playableColumns.find((col) => this.simulateWin(col, opponentCode));
    if (blocking !== undefined) return blocking;

    const center = Math.floor(BOARD_COLUMNS / 2);
    const sorted = [...playableColumns].sort((a, b) => Math.abs(a - center) - Math.abs(b - center));
    const minDist = Math.abs(sorted[0] - center);
    const best = sorted.filter((col) => Math.abs(col - center) === minDist);
    return best[Math.floor(Math.random() * best.length)];
  }

  private simulateWin(column: number, playerCode: PlayerCode) {
    const row = findLandingRow(this.board(), column);
    if (row === -1) return false;

    const simBoard = this.board().map((boardRow, rowIndex) =>
      rowIndex !== row
        ? boardRow
        : boardRow.map((cell, colIndex) => (colIndex !== column ? cell : playerCode)),
    );
    return !!this.checkWin(simBoard, row, column, playerCode);
  }

  private checkWin(
    board: Board,
    row: number,
    col: number,
    playerCode: PlayerCode,
  ): WinCells | null {
    for (const { row: dRow, column: dCol } of WIN_DIRECTIONS) {
      const forward = this.collect(board, row, col, dRow, dCol, playerCode);
      const backward = this.collect(board, row, col, -dRow, -dCol, playerCode);

      if (1 + forward.length + backward.length >= CONNECT_LENGTH) {
        const all = [...backward.reverse(), { row, column: col }, ...forward];
        return all.slice(0, CONNECT_LENGTH) as WinCells;
      }
    }
    return null;
  }

  private collect(
    board: Board,
    startRow: number,
    startCol: number,
    dRow: number,
    dCol: number,
    playerCode: PlayerCode,
  ): CellPosition[] {
    const cells: CellPosition[] = [];
    let r = startRow + dRow;
    let c = startCol + dCol;

    while (r >= 0 && r < BOARD_ROWS && c >= 0 && c < BOARD_COLUMNS && board[r][c] === playerCode) {
      cells.push({ row: r, column: c });
      r += dRow;
      c += dCol;
    }
    return cells;
  }

  private handleTick() {
    if (this.phase() !== 'running') return;

    const next = this.secondsLeft() - 1;
    if (next <= 0) {
      this.patchState({
        secondsLeft: 0,
        phase: 'round-over',
        winner: this.currentOpponentCode(),
        scores: this.incrementScore(this.currentOpponentCode()),
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

  private triggerCpuIfNeeded() {
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
  scores: ScorePlayers;
  winner: PlayerCode | null;
  winningCells: WinCells | null;
  secondsLeft: number;
}

const initialState: GameState = {
  mode: 'pvp',
  phase: 'paused',
  players: getPlayersByMode('pvp'),
  board: createEmptyBoard(),
  currentPlayer: 'first',
  scores: {
    first: 0,
    second: 0,
  },
  winner: null,
  winningCells: null,
  secondsLeft: TURN_DURATION_SECONDS,
};
