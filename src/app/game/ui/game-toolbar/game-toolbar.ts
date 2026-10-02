import { Component, output, ChangeDetectionStrategy } from '@angular/core';
import { Logo } from '../../../shared/ui/logo/logo';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-game-toolbar',
  imports: [MatButtonModule, Logo],
  templateUrl: './game-toolbar.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './game-toolbar.scss',
})
export class GameToolbar {
  menuGameClicked = output<void>();
  restartGameClicked = output<void>();
}
