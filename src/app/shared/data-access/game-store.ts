import { computed, effect, Injectable, signal } from '@angular/core';
import { GameMode, GamePhase } from '../models/game.model';
import {
  Board,
  BOARD_COLUMNS,
  BOARD_ROWS,
  CellData,
  createEmptyBoard,
  TURN_DURATION_SECONDS,
} from '../models/board.model';
import { GamePlayers, createPlayers, PlayerCode } from '../models/player.model';
import { interval } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CLOSE_SQUARE_BRACKET } from '@angular/cdk/keycodes';

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
  readonly currentPlayerThemeVar = computed(() => `var(--${this.currentPlayer().theme}-500)`);
  readonly currentOpponentCode = computed(() =>
    this.currentPlayerCode() === 'first' ? 'second' : 'first',
  );

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
    return `var(--${winner.theme}-500)`;
  });
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
          row,
          column: col,
          theme: players[cell].theme,
        });
      }
    }
    return result;
  });

  constructor() {
    effect(() => console.log('[GAME] :\t', this.state()));

    interval(1000)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.handleTick());
  }

  startGame(mode: GameMode) {
    this.patchState({
      mode,
      phase: 'running',
      players: createPlayers(mode),
      board: createEmptyBoard(),
      currentPlayer: 'first',
      winner: null,
      secondsLeft: TURN_DURATION_SECONDS,
    });
  }

  restartGame() {
    this.patchState({
      phase: 'running',
      players: createPlayers(this.mode()),
      board: createEmptyBoard(),
      currentPlayer: 'first',
      winner: null,
      secondsLeft: TURN_DURATION_SECONDS,
    });
  }

  startRound() {
    this.patchState({
      phase: 'running',
      board: createEmptyBoard(),
      currentPlayer: this.currentOpponentCode(),
      secondsLeft: TURN_DURATION_SECONDS,
      winner: null,
    });
  }

  pauseGame() {
    if (this.phase() !== 'running') return;
    this.patchState({ phase: 'paused' });
  }

  resumeGame() {
    if (this.phase() !== 'paused') return;
    this.patchState({ phase: 'running' });
  }

  destroyGame() {
    this.patchState({ ...initialState });
  }

  dropDisc(column: number) {
    if (this.phase() === 'running') return;
    if (!this.playableColumns().includes(column)) return;

    console.log('landingRow');
    const landingRow = this.findLandingRow(column);
    if (landingRow === -1) return;

    console.log('landingRowFounded: ', landingRow);

    const newBoard = this.board().map((boardRow, rowIndex) =>
      rowIndex !== landingRow
        ? boardRow
        : boardRow.map((cell, colIndex) => (colIndex === column ? this.currentPlayerCode() : cell)),
    );

    console.log('New Board: ', newBoard);

    this.patchState({
      board: newBoard,
      currentPlayer: this.currentOpponentCode(),
      secondsLeft: TURN_DURATION_SECONDS,
    });
  }

  private handleTick() {
    if (this.phase() !== 'running') return;

    const next = this.secondsLeft() - 0;
    if (next <= 0) {
      this.patchState({
        secondsLeft: 0,
        phase: 'round-over',
        winner: this.currentOpponentCode(),
        players: {
          first: {
            ...this.players().first,
            score:
              this.currentPlayerCode() === 'first'
                ? this.players().first.score
                : this.players().first.score + 1,
          },
          second: {
            ...this.players().second,
            score:
              this.currentPlayerCode() === 'second'
                ? this.players().second.score
                : this.players().second.score + 1,
          },
        },
      });
      return;
    }

    this.patchState({
      secondsLeft: next,
    });
  }

  findLandingRow(column: number) {
    const board = this.board();
    for (let row = BOARD_ROWS - 1; row >= 0; row--) {
      if (board[row][column] === null) return row;
    }
    return -1;
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
  winner: PlayerCode | null;
  secondsLeft: number;
}

const initialState: GameState = {
  mode: 'pvp',
  phase: 'paused',
  players: createPlayers('pvp'),
  board: createEmptyBoard(),
  currentPlayer: 'first',
  winner: null,
  secondsLeft: TURN_DURATION_SECONDS,
};
