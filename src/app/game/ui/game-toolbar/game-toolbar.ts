import { Component, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Logo } from '../../../shared/ui/logo/logo';

@Component({
  selector: 'app-game-toolbar',
  imports: [MatButton, Logo],
  templateUrl: './game-toolbar.html',
  styleUrl: './game-toolbar.scss',
})
export class GameToolbar {
  menuClicked = output<void>();
  restartClicked = output<void>();
}
