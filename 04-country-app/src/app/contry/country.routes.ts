import { Routes } from '@angular/router';
import { CountryLayoutComponent } from './layouts/country-layout/country-layout.component';

export const countryRoutes: Routes = [
  {
    path: '',
    component: CountryLayoutComponent,
    children: [
      {
        path: 'by-capital',
        loadComponent: () => import('./pages/by-capital-page/by-capital-page.component').then((m) => m.ByCapitalPageComponent),
      },
      {
        path: '**',
        redirectTo: 'by-capital',
      }
    ]
  },
];
