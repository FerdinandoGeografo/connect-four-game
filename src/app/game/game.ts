import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, computed, DestroyRef, effect, inject } from '@angular/core';
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
  private readonly announcer = inject(LiveAnnouncer);
  protected readonly gameStore = inject(GameStore);
  protected readonly playerCodes = PLAYER_CODES;
  protected readonly bannerLayers = computed(() => [
    { key: this.gameStore.winnerCode() ?? 'none', color: this.gameStore.winner()?.theme },
  ]);

  /** Changes on moves, turns, pause and round end, never on timer ticks. */
  private readonly statusMessage = computed(() => {
    const store = this.gameStore;
    const turn = `${store.currentPlayer().turnLabel}.`;

    switch (store.phase()) {
      case 'idle':
        return '';
      case 'paused':
        return 'Game paused.';
      case 'round-over': {
        const winner = store.winner();
        if (!winner) return 'The board is full. Draw.';
        const result = `${winner.label} ${winner.winVerb}`;
        return store.roundEnd() === 'timeout'
          ? `Time's up. ${result}.`
          : `${result} with four in a row.`;
      }
      case 'running': {
        const move = store.lastMove();
        if (!move) return turn;
        const mover = store.players()[move.player];
        return `${mover.label} dropped a disc in column ${move.position.column + 1}. ${turn}`;
      }
    }
  });

  constructor() {
    // Leaving the route (e.g. browser back) must not keep the turn timer running.
    inject(DestroyRef).onDestroy(() => this.gameStore.pauseGame());
    this.gameStore.resumeGame();

    // The CDK live element exists before the text arrives, so the opening turn is announced too.
    effect(() => {
      const message = this.statusMessage();
      if (message) this.announcer.announce(message, 'polite');
    });
  }

  protected openGameMenu() {
    this.gameStore.pauseGame();
    this.dialog
      .open<InGameMenu, void, PauseAction>(InGameMenu, {
        ariaLabelledBy: 'pause-dialog-title',
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
