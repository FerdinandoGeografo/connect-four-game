import { Component, computed, DestroyRef, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GameStore } from '../shared/data-access/game-store';
import { PLAYER_CODES } from '../shared/models/player.model';
import { GameBoard } from './ui/game-board/game-board';
import { GameToolbar } from './ui/game-toolbar/game-toolbar';
import { InGameMenu, PauseAction } from './ui/in-game-menu/in-game-menu';
import { OutcomeCard } from './ui/outcome-card/outcome-card';
import { ScoreCard } from './ui/score-card/score-card';
import { TurnIndicator } from './ui/turn-indicator/turn-indicator';

@Component({
  selector: 'app-game',
  imports: [GameToolbar, ScoreCard, TurnIndicator, OutcomeCard, GameBoard],
  templateUrl: './game.html',
  styleUrl: './game.scss',
})
export class Game {
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  protected readonly gameStore = inject(GameStore);
  protected readonly playerCodes = PLAYER_CODES;
  // A new key re-creates the layer, so it rises over the previous one.
  protected readonly bannerLayers = computed(() => [
    { key: this.gameStore.winnerCode() ?? 'none', color: this.gameStore.winner()?.theme },
  ]);

  constructor() {
    // Leaving the route (e.g. browser back) must not keep the turn timer running.
    inject(DestroyRef).onDestroy(() => this.gameStore.pauseGame());
    this.gameStore.resumeGame();
  }

  protected openGameMenu() {
    this.gameStore.pauseGame();
    this.dialog
      .open<InGameMenu, void, PauseAction>(InGameMenu, {
        ariaLabelledBy: 'pause-dialog-title',
        // Scrolls instead of overflowing on landscape phones.
        maxHeight: 'calc(100dvh - 2rem)',
      })
      .afterClosed()
      .subscribe((action) => this.onPauseClosed(action));
  }

  /** Escape and backdrop clicks close without an action: the game resumes. */
  private onPauseClosed(action: PauseAction | undefined) {
    switch (action) {
      case 'restart':
        this.gameStore.restartGame();
        break;
      case 'quit':
        this.gameStore.destroyGame();
        this.router.navigate(['/main-menu']);
        break;
      default:
        this.gameStore.resumeGame();
    }
  }
}
