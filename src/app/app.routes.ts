import { inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';
import { GameStore } from './shared/data-access/game-store';

/** A game can only be entered after choosing a mode from the main menu. */
const gameStartedGuard: CanActivateFn = () =>
  inject(GameStore).phase() !== 'idle' || inject(Router).createUrlTree(['/main-menu']);

export const routes: Routes = [
  {
    path: 'main-menu',
    title: 'Main menu | Connect Four',
    loadComponent: () => import('./main-menu/main-menu').then((c) => c.MainMenu),
  },
  {
    path: 'game',
    title: 'Game | Connect Four',
    canActivate: [gameStartedGuard],
    loadComponent: () => import('./game/game').then((c) => c.Game),
  },
  {
    path: 'rules',
    title: 'Rules | Connect Four',
    loadComponent: () => import('./rules/rules').then((c) => c.Rules),
  },
  {
    path: '**',
    redirectTo: 'main-menu',
  },
];
