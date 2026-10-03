import { Component, input } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { Player } from '../../../shared/models/player.model';

@Component({
  selector: 'app-score-card',
  imports: [MatCard, MatCardContent, MatIcon],
  templateUrl: './score-card.html',
  styleUrl: './score-card.scss',
  host: {
    '[class.score--end]': "side() === 'end'",
  },
})
export class ScoreCard {
  player = input.required<Player>();
  score = input.required<number>();
  /** Which side of the board the card sits on: the avatar is mirrored for 'end'. */
  side = input<'start' | 'end'>('start');
}
