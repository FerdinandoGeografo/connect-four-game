import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, inject, input } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { MatIcon } from '@angular/material/icon';
import { skip } from 'rxjs';
import { Player } from '../../../shared/models/player.model';

const EASE_OUT = 'cubic-bezier(0.2, 0.8, 0.2, 1)';
const TURN_SWAP: Keyframe[] = [
  { scale: 0.6, easing: EASE_OUT },
  { scale: 1.04, offset: 0.7, easing: EASE_OUT },
  { scale: 1 },
];

@Component({
  selector: 'app-turn-indicator',
  imports: [MatIcon],
  templateUrl: './turn-indicator.html',
  styleUrl: './turn-indicator.scss',
})
export class TurnIndicator {
  currentPlayer = input.required<Player>();
  time = input.required<number>();

  constructor() {
    const host: HTMLElement = inject(ElementRef).nativeElement;
    const reducedMotion = inject(DOCUMENT).defaultView?.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );

    toObservable(this.currentPlayer)
      .pipe(skip(1), takeUntilDestroyed())
      .subscribe(() => {
        if (!reducedMotion?.matches) host.animate(TURN_SWAP, 400);
      });
  }
}
