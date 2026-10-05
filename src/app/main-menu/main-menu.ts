import { Component, inject } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { Router } from '@angular/router';
import { GameStore } from '../shared/data-access/game-store';
import { GameMode } from '../shared/models/game.model';
import { MenuItem } from '../shared/models/menu-item.model';
import { Logo } from '../shared/ui/logo/logo';
import { MenuItems } from '../shared/ui/menu-items/menu-items';

@Component({
  selector: 'app-main-menu',
  imports: [MatCard, MatCardContent, Logo, MenuItems],
  templateUrl: './main-menu.html',
  styleUrl: './main-menu.scss',
})
export class MainMenu {
  private readonly router = inject(Router);
  private readonly gameStore = inject(GameStore);

  protected readonly menuItems: MenuItem[] = [
    {
      label: 'Play vs CPU',
      icon: 'player-vs-cpu',
      onClick: () => this.startGame('pvcpu'),
    },
    {
      styleClass: 'btn--secondary',
      label: 'Play vs Player',
      icon: 'player-vs-player',
      onClick: () => this.startGame('pvp'),
    },
    {
      styleClass: 'btn--neutral',
      label: 'Game rules',
      onClick: () => this.router.navigate(['/rules']),
    },
  ];

  private startGame(mode: GameMode) {
    this.gameStore.startGame(mode);
    this.router.navigate(['/game']);
  }
}
