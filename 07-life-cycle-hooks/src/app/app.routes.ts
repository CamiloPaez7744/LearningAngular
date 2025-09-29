import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home-page/home-page.component').then(c => c.HomePageComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about-page/about-page.component').then(c => c.AboutPageComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact-page/contact-page.component').then(c => c.ContactPageComponent)
  },
  {
    path: '**',
    redirectTo: ''
  },
];
