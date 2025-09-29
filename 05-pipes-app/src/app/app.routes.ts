import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'basic',
    title: 'BasicPipes',
    loadComponent: () => import('./pages/basic-page/basic-page.component').then((c) => c.BasicPageComponent),
  },
  {
    path: 'numbers',
    title: 'NumberPipes',
    loadComponent: () => import('./pages/numbers-page/numbers-page.component').then((c) => c.NumbersPageComponent),
  },
  {
    path: 'uncommon',
    title: 'UncommonPipes',
    loadComponent: () => import('./pages/uncommon-page/uncommon-page.component').then((c) => c.UncommonPageComponent),
  },
  {
    path: 'custom',
    title: 'CustomPipes',
    loadComponent: () => import('./pages/custom-page/custom-page.component').then((c) => c.CustomPageComponent),
  },
  {
    path: '**',
    redirectTo: 'basic',
  }
];
