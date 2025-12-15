import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'main-menu',
    loadComponent: () => import('./main-menu/main-menu').then((c) => c.MainMenu),
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
