import { Component, computed, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardContent } from '@angular/material/card';
import { Player } from '../../../shared/models/player.model';

@Component({
  selector: 'app-outcome-card',
  imports: [MatCard, MatCardContent, MatButton],
  templateUrl: './outcome-card.html',
  styleUrl: './outcome-card.scss',
})
export class OutcomeCard {
  winner = input.required<Player | null>();

  winnerLabel = computed(() => {
    const winner = this.winner();
    return winner ? winner.label : 'Board full';
  });
  winnerOutcome = computed(() => {
    const winner = this.winner();
    return winner ? winner.winVerb : 'Draw';
  });

  playAgainClicked = output<void>();
}
