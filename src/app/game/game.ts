import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { GameToolbar } from './ui/game-toolbar/game-toolbar';
import { ScoreCard } from './ui/score-card/score-card';
import { TurnIndicator } from './ui/turn-indicator/turn-indicator';
import { OutcomeCard } from './ui/outcome-card/outcome-card';
import { MatIcon } from '@angular/material/icon';
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
    if (this.gameStore.phase() !== 'running') {
      this.gameStore.startRound();
    }
  }

  openGameMenu() {
    this.gameStore.pauseGame();
    const ref = this.dialog.open<InGameMenu, MenuItem[], never>(InGameMenu, {
      disableClose: false,
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
  }
}
