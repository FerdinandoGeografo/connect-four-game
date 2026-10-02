import { Component, inject, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { GameToolbar } from './ui/game-toolbar/game-toolbar';
import { ScoreCard } from './ui/score-card/score-card';
import { TurnIndicator } from './ui/turn-indicator/turn-indicator';
import { OutcomeCard } from './ui/outcome-card/outcome-card';
import { GameStore } from '../shared/data-access/game-store';
import { MatDialog } from '@angular/material/dialog';
import { InGameMenu } from './ui/in-game-menu/in-game-menu';
import { MenuItem } from '../shared/models/menu-item.model';
import { Router } from '@angular/router';
import { GameBoard } from './ui/game-board/game-board';

@Component({
  selector: 'app-game',
  imports: [GameToolbar, ScoreCard, TurnIndicator, OutcomeCard, GameBoard],
  templateUrl: './game.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './game.scss',
})
export class Game {
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  protected readonly gameStore = inject(GameStore);

  constructor() {
    // Leaving the route (e.g. browser back) must not keep the turn timer running.
    inject(DestroyRef).onDestroy(() => this.gameStore.pauseGame());
    this.gameStore.resumeGame();
  }

  openGameMenu() {
    this.gameStore.pauseGame();
    const ref = this.dialog.open<InGameMenu, MenuItem[], never>(InGameMenu, {
      disableClose: false,
      ariaLabelledBy: 'pause-dialog-title',
      // Lets the menu scroll instead of overflowing on landscape phones.
      maxHeight: 'calc(100dvh - 2rem)',
      data: [
        {
          styleClass: 'btn--neutral btn--center',
          label: 'Continue game',
          onClick: () => {
            this.gameStore.resumeGame();
            ref.close();
          },
        },
        {
          styleClass: 'btn--neutral btn--center',
          label: 'Restart',
          onClick: () => {
            this.gameStore.restartGame();
            ref.close();
          },
        },
        {
          styleClass: 'btn--primary btn--center',
          label: 'Quit game',
          onClick: () => {
            this.gameStore.destroyGame();
            ref.close();
            this.router.navigate(['/main-menu']);
          },
        },
      ],
    });

    // Escape and backdrop clicks close the dialog without choosing an item: resume the game.
    ref.afterClosed().subscribe(() => this.gameStore.resumeGame());
  }
}
