import { Routes } from '@angular/router';
import { BasicPageComponent } from './pages/basic-page/basic-page.component';
import { DynamicPageComponent } from './pages/dynamic-page/dynamic-page.component';

export const reactiveRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'basic',
        component: BasicPageComponent,
      },
      {
        path: 'dynamic',
        component: DynamicPageComponent,
      },
      {
        path: 'switches',
        loadComponent: () => import('./pages/switches-page/switches-page.component').then( c => c.SwitchesPageComponent )
      },
      {
        path: '**',
        redirectTo: 'basic',
      }
    ]
  }
];
