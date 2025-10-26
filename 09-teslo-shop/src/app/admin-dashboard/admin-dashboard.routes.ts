import { Routes } from '@angular/router';
import { AdminDashboardLayoutComponent } from './layouts/admin-dashboard-layout/admin-dashboard-layout.component';

export const adminDashboardRoutes: Routes = [
  {
    path: '',
    component: AdminDashboardLayoutComponent,
    children: [
      {
        path: 'products',
        loadComponent: () => import('./pages/products-admin-page/products-admin-page.component').then(m => m.ProductsAdminPageComponent)
      },
      {
        path: 'product/:id',
        loadComponent: () => import('./pages/product-admin-page/product-admin-page.component').then(m => m.ProductAdminPageComponent)
      },
      {
        path: '**',
        redirectTo: 'products',
      },
    ]
  }
];

export default adminDashboardRoutes;
