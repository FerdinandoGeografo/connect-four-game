import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { MenuItem } from '../../models/menu-item.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-menu-items',
  imports: [MatButtonModule, MatIcon],
  templateUrl: './menu-items.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './menu-items.scss',
})
export class MenuItems {
  items = input.required<MenuItem[]>();
}
