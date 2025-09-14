import { Routes } from '@angular/router';
import { HomePageComponent } from './contry/pages/home-page/home-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
  },
  {
    path: 'country',
    loadChildren: () => import('./contry/country.routes').then((m) => m.countryRoutes),
  },
  {
    path: '**',
    redirectTo: '',
  }
];
