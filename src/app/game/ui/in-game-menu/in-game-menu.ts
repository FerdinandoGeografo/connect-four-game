import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MenuItem } from '../../../shared/models/menu-item.model';
import { MenuItems } from '../../../shared/ui/menu-items/menu-items';

export type PauseAction = 'continue' | 'restart' | 'quit';

@Component({
  selector: 'app-in-game-menu',
  imports: [MenuItems],
  templateUrl: './in-game-menu.html',
  styleUrl: './in-game-menu.scss',
})
export class InGameMenu {
  private readonly dialogRef = inject<MatDialogRef<InGameMenu, PauseAction>>(MatDialogRef);

  protected readonly items: MenuItem[] = [
    {
      styleClass: 'btn--neutral btn--center',
      label: 'Continue game',
      onClick: () => this.close('continue'),
    },
    {
      styleClass: 'btn--neutral btn--center',
      label: 'Restart',
      onClick: () => this.close('restart'),
    },
    {
      styleClass: 'btn--primary btn--center',
      label: 'Quit game',
      onClick: () => this.close('quit'),
    },
  ];

  private close(action: PauseAction) {
    this.dialogRef.close(action);
  }
}
