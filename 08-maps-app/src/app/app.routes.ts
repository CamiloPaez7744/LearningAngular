import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'full-screen-map',
    loadComponent: () => import('./pages/full-screen-map-page/full-screen-map-page.component').then(m => m.FullScreenMapPageComponent),
    title: 'Full Screen Map'
  },
  {
    path: 'markers',
    loadComponent: () => import('./pages/markers-page/markers-page.component').then(m => m.MarkersPageComponent),
    title: 'Markers'
  },
  {
    path: 'houses',
    loadComponent: () => import('./pages/houses-page/houses-page.component').then(m => m.HousesPageComponent),
    title: 'Available Houses'
  },
  {
    path: '**',
    redirectTo: 'full-screen-map'
  }
];
