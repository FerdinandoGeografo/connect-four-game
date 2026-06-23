import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Logo } from '../shared/ui/logo/logo';
import { GameStore } from '../shared/data-access/game-store';
import { MenuItem } from '../shared/models/menu-item.model';
import { MenuItems } from '../shared/ui/menu-items/menu-items';
import { MatCard, MatCardContent } from '@angular/material/card';

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
      onClick: () => this.startPvCpu(),
    },
    {
      styleClass: 'btn--secondary',
      label: 'Play vs Player',
      icon: 'player-vs-player',
      onClick: () => this.startPvp(),
    },
    {
      styleClass: 'btn--neutral btn--start',
      label: 'Game rules',
      onClick: () => this.navigateToRules(),
    },
  ];

  private startPvp() {
    this.gameStore.startGame('pvp');
    this.router.navigate(['/game']);
  }

  private startPvCpu() {
    this.gameStore.startGame('pvcpu');
    this.router.navigate(['/game']);
  }

  private navigateToRules() {
    this.router.navigate(['/rules']);
  }
}
