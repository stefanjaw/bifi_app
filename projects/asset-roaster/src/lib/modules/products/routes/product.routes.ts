import { Routes } from '@angular/router';
import { authGuard } from '@avalantec/base-app/auth';

export const PRODUCT_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/products-list/products-list').then(m => m.ProductsList),
  },
  {
    path: 'maintenance/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/product-maintenance/product-maintenance').then(m => m.ProductMaintenance),
  },
];
