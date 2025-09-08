import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./gifs/pages/dashboard-page/dashboard-page.component').then(m => m.DashboardPageComponent),
    children: [
      {
        path: 'search',
        loadComponent: () => import('./gifs/pages/search-page/search-page.component').then(m => m.SearchPageComponent)
      },
      {
        path: 'trending',
        loadComponent: () => import('./gifs/pages/trending-page/trending-page.component').then(m => m.TrendingPageComponent)
      },
      {
        path: '**',
        redirectTo: 'trending'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
