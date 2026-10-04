import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { CellData } from '../../../../shared/models/board.model';

@Component({
  selector: 'app-game-cell',
  imports: [MatIcon],
  templateUrl: './game-cell.html',
  styleUrl: './game-cell.scss',
  host: {
    '[style.--row]': 'cell().position.row',
    '[style.--col]': 'cell().position.column',
    '[class.winning]': 'winIndex() !== null',
    '[style.--win-index]': 'winIndex()',
  },
})
export class GameCell {
  cell = input.required<CellData>();
  /** Position in the winning line (0-3), staggers the ring animation. */
  winIndex = input<number | null>(null);
}
