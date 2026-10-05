import { DOCUMENT } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  inject,
  input,
  linkedSignal,
  output,
  signal,
  viewChildren,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {
  Board,
  BOARD_COLUMNS,
  BOARD_ROWS,
  CellData,
  findLandingRow,
  WinCells,
} from '../../../shared/models/board.model';
import { GamePlayers, Player } from '../../../shared/models/player.model';
import { GameCell } from './game-cell/game-cell';

@Component({
  selector: 'app-game-board',
  imports: [MatIcon, GameCell],
  templateUrl: './game-board.html',
  styleUrl: './game-board.scss',
  host: {
    '[class.board--won]': '!!winningCells()',
  },
})
export class GameBoard {
  board = input.required<Board>();
  cells = input.required<CellData[]>();
  players = input.required<GamePlayers>();
  currentPlayer = input.required<Player>();
  canPlay = input.required<boolean>();
  playableColumns = input.required<number[]>();
  winningCells = input<WinCells | null>(null);
  discDropped = output<number>();

  protected readonly columns = Array.from({ length: BOARD_COLUMNS }, (_, i) => i);

  private readonly document = inject(DOCUMENT);
  private readonly columnButtons = viewChildren<ElementRef<HTMLButtonElement>>('columnButton');

  /** Column under the pointer or focused; drives marker and preview. */
  protected readonly activeColumn = signal<number | null>(null);
  /** Roving tabindex: the board is a single tab stop, arrows move between columns. */
  protected readonly focusableColumn = signal(Math.floor(BOARD_COLUMNS / 2));
  /** Keeps the last column, so the marker hides in place instead of sliding back. */
  protected readonly markerColumn = linkedSignal<number | null, number>({
    source: this.activeColumn,
    computation: (column, previous) => column ?? previous?.value ?? Math.floor(BOARD_COLUMNS / 2),
  });
  protected readonly showMarker = computed(() => {
    const column = this.activeColumn();
    return column !== null && this.isColumnEnabled(column);
  });
  protected readonly previewCell = computed(() => {
    const column = this.activeColumn();
    if (column === null || !this.isColumnEnabled(column)) return null;
    return { row: findLandingRow(this.board(), column), column };
  });
  protected readonly columnLabels = computed(() => {
    const board = this.board();
    const players = this.players();

    return this.columns.map((column) => {
      const discs: string[] = [];
      for (let row = BOARD_ROWS - 1; row >= 0; row--) {
        const cell = board[row][column];
        if (cell) discs.push(players[cell].label);
      }
      const free = BOARD_ROWS - discs.length;
      const contents = discs.length ? `${discs.join(', ')} from the bottom` : 'empty';
      const slots = free ? `${free} ${free === 1 ? 'slot' : 'slots'} free` : 'full';
      return `Column ${column + 1}: ${contents}, ${slots}`;
    });
  });

  protected isColumnEnabled(column: number) {
    return this.canPlay() && this.playableColumns().includes(column);
  }

  protected winIndex(cell: CellData) {
    const { row, column } = cell.position;
    const index = this.winningCells()?.findIndex((c) => c.row === row && c.column === column) ?? -1;
    return index === -1 ? null : index;
  }

  protected onColumnClick(column: number) {
    // Disabled columns stay focusable (aria-disabled), so clicks must be ignored here.
    if (!this.isColumnEnabled(column)) return;
    this.discDropped.emit(column);
  }

  protected onKeydown(event: KeyboardEvent, column: number) {
    const target = this.keyboardTarget(event.key, column);
    if (target === null) return;

    event.preventDefault();
    this.focusableColumn.set(target);
    this.columnButtons()[target]?.nativeElement.focus();
  }

  protected onBoardLeave() {
    const focused = this.columnButtons().findIndex(
      (button) => button.nativeElement === this.document.activeElement,
    );
    this.activeColumn.set(focused === -1 ? null : focused);
  }

  private keyboardTarget(key: string, column: number): number | null {
    switch (key) {
      case 'ArrowLeft':
        return Math.max(0, column - 1);
      case 'ArrowRight':
        return Math.min(BOARD_COLUMNS - 1, column + 1);
      case 'Home':
        return 0;
      case 'End':
        return BOARD_COLUMNS - 1;
      default:
        return null;
    }
  }
}
