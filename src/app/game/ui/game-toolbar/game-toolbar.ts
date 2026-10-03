import { Component, output } from '@angular/core';
import { Logo } from '../../../shared/ui/logo/logo';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-game-toolbar',
  imports: [MatButtonModule, Logo],
  templateUrl: './game-toolbar.html',
  styleUrl: './game-toolbar.scss',
})
export class GameToolbar {
  menuClicked = output<void>();
  restartClicked = output<void>();
}
