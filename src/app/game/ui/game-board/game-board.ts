import { Component, computed, input, output, signal, ChangeDetectionStrategy } from '@angular/core';
import {
  Board,
  BOARD_COLUMNS,
  BOARD_ROWS,
  CellData,
  findLandingRow,
  WinCells,
} from '../../../shared/models/board.model';
import { MatIcon } from '@angular/material/icon';
import { GamePhase } from '../../../shared/models/game.model';
import { GamePlayers, Player } from '../../../shared/models/player.model';
import { GameCell } from './game-cell/game-cell';

@Component({
  selector: 'app-game-board',
  imports: [MatIcon, GameCell],
  templateUrl: './game-board.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './game-board.scss',
})
export class GameBoard {
  board = input.required<Board>();
  cells = input.required<CellData[]>();
  players = input.required<GamePlayers>();
  currentPlayer = input.required<Player>();
  phase = input.required<GamePhase>();
  playableColumns = input.required<number[]>();
  winningCells = input<WinCells | null>(null);
  discDropped = output<number>();

  protected readonly columns = Array.from({ length: BOARD_COLUMNS }, (_, i) => i);
  protected readonly rows = Array.from({ length: BOARD_ROWS }, (_, i) => i);

  protected readonly hoveredColumn = signal<number | null>(0);
  protected readonly previewCell = computed(() => {
    const col = this.hoveredColumn();
    if (col === null) return null;
    const landingRow = findLandingRow(this.board(), col);
    if (landingRow === -1) return null;

    return { row: landingRow, column: col };
  });
  protected readonly markerLeft = computed(() => {
    const col = this.hoveredColumn() ?? 0;
    const CELL_WIDTH = 70;
    const MARKER_WIDTH = 38;
    const GAP = 18;
    const PADDING = 17;
    return PADDING + col * (CELL_WIDTH + GAP) + (CELL_WIDTH - MARKER_WIDTH) / 2;
  });

  protected onColumnHover(col: number) {
    if (this.phase() !== 'running') return;
    if (!this.playableColumns().includes(col)) return;
    this.hoveredColumn.set(col);
  }

  protected onColumnClick(col: number) {
    this.discDropped.emit(col);

    if (!this.playableColumns().includes(col)) {
      this.hoveredColumn.set(null);
    }
  }
}
