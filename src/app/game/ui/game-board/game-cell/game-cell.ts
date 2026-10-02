import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { CellData } from '../../../../shared/models/board.model';

/**
 * A dropped disc. The board renders one per occupied cell, tracked by cell id,
 * so the drop animation runs once when the disc is created and never restarts
 * on unrelated state updates.
 */
@Component({
  selector: 'app-game-cell',
  imports: [MatIcon],
  templateUrl: './game-cell.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './game-cell.scss',
  host: {
    '[style.--row]': 'cell().position.row',
    '[style.--col]': 'cell().position.column',
    '[class.winning]': 'winning()',
  },
})
export class GameCell {
  cell = input.required<CellData>();
  winning = input(false);
}
