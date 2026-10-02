import { inject } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { GameStore } from './shared/data-access/game-store';

export const routes: Routes = [
  {
    path: 'main-menu',
    loadComponent: () => import('./main-menu/main-menu').then((c) => c.MainMenu),
  },
  {
    path: 'game',
    // A game can only be entered after choosing a mode from the main menu.
    canActivate: [
      () => inject(GameStore).phase() !== 'idle' || inject(Router).createUrlTree(['/main-menu']),
    ],
    loadComponent: () => import('./game/game').then((c) => c.Game),
  },
  {
    path: 'rules',
    loadComponent: () => import('./rules/rules').then((c) => c.Rules),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'main-menu',
  },
];
