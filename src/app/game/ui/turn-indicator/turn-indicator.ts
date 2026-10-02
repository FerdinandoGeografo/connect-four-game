import { Component, computed, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Player } from '../../../shared/models/player.model';

@Component({
  selector: 'app-turn-indicator',
  imports: [MatIcon],
  templateUrl: './turn-indicator.html',
  styleUrl: './turn-indicator.scss',
})
export class TurnIndicator {
  currentPlayer = input.required<Player>();
  time = input.required<number>();

  textColor = computed(
    () => `var(--neutral-${this.currentPlayer().theme.includes('red') ? '0' : '900'}`,
  );
}
