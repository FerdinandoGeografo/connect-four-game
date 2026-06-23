import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MenuItem } from '../../../shared/models/menu-item.model';
import { MenuItems } from '../../../shared/ui/menu-items/menu-items';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-in-game-menu',
  imports: [MatCardModule, MenuItems],
  templateUrl: './in-game-menu.html',
  styleUrl: './in-game-menu.scss',
})
export class InGameMenu {
  items = inject<MenuItem[]>(MAT_DIALOG_DATA);
}
