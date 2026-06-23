import { Component, computed, effect, inject, signal } from '@angular/core';
import { GameStore } from '../../../shared/data-access/game-store';
import { BOARD_COLUMNS, BOARD_ROWS } from '../../../shared/models/board.model';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-game-board',
  imports: [MatIcon],
  templateUrl: './game-board.html',
  styleUrl: './game-board.scss',
})
export class GameBoard {
  protected readonly gameStore = inject(GameStore);

  protected readonly columns = Array.from({ length: BOARD_COLUMNS }, (_, i) => i);
  protected readonly rows = Array.from({ length: BOARD_ROWS }, (_, i) => i);

  protected readonly hoveredColumn = signal<number | null>(0);
  protected readonly previewCell = computed(() => {
    const col = this.hoveredColumn();
    if (col === null) return null;
    const landingRow = this.gameStore.findLandingRow(col);
    if (landingRow === -1) return null;

    return { row: landingRow, column: col };
  });
  protected readonly markerLeft = computed(() => {
    const col = this.hoveredColumn() ?? 0;
    const CELL_WIDTH = 70;
    const MARKER_WIDTH = 38;
    const GAP = 18;
    const SPACING = (CELL_WIDTH - MARKER_WIDTH) / 2;
    const PADDING = 17;
    return PADDING + col * (CELL_WIDTH + GAP) + SPACING;
  });

  constructor() {
    effect(() => console.log('Marker offset changed! :', this.markerLeft()));
  }

  protected onColumnHover(col: number) {
    if (this.gameStore.phase() !== 'running') return;
    if (!this.gameStore.playableColumns().includes(col)) return;
    this.hoveredColumn.set(col);
  }

  protected onColumnClick(col: number) {
    this.gameStore.dropDisc(col);

    if (!this.gameStore.playableColumns().includes(col)) {
      this.hoveredColumn.set(null);
    }
  }
}
