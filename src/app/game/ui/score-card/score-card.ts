import { UpperCasePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { Player } from '../../../shared/models/player.model';

@Component({
  selector: 'app-score-card',
  imports: [MatCard, MatCardContent, MatIcon, UpperCasePipe],
  templateUrl: './score-card.html',
  styleUrl: './score-card.scss',
})
export class ScoreCard {
  player = input.required<Player>();
}
