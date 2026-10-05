import { Component, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MenuItem } from '../../models/menu-item.model';

@Component({
  selector: 'app-menu-items',
  imports: [MatButton, MatIcon],
  templateUrl: './menu-items.html',
  styleUrl: './menu-items.scss',
})
export class MenuItems {
  items = input.required<MenuItem[]>();
}
