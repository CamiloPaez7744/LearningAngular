
import { Routes } from '@angular/router';
import { MapPageComponent } from './pages/map-page/map-page.component';

export const dashboardRoutes: Routes = [
  {
    path: 'map',
    loadComponent: () => import('./pages/map-page/map-page.component').then(m => m.MapPageComponent)
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
];
