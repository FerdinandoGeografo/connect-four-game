import { Component, computed, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { CellData, CellPosition, WinCells } from '../../../../shared/models/board.model';
import { Player } from '../../../../shared/models/player.model';

@Component({
  selector: 'app-game-cell',
  imports: [MatIcon],
  templateUrl: './game-cell.html',
  styleUrl: './game-cell.scss',
  host: {
    '[class.preview]': 'isPreview()',
    '[style.--preview-color]': 'currentPlayer().theme',
  },
})
export class GameCell {
  cells = input.required<CellData[]>();
  position = input.required<CellPosition>();
  currentPlayer = input.required<Player>();
  isPreview = input.required<boolean>();
  winningCells = input.required<WinCells | null>();

  protected readonly cell = computed(() => {
    const { row, column } = this.position();
    const cell = this.cells().find((c) => c.position.row === row && c.position.column === column);
    if (!cell) return null;
    return cell;
  });
  protected readonly inWinCells = computed(
    () =>
      !!this.winningCells()?.find(
        (c) => c.column === this.cell()?.position.column && c.row === this.cell()?.position.row,
      ),
  );
}
