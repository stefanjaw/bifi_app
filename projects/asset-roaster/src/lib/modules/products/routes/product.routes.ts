import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const PRODUCT_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/products-list/products-list').then(m => m.ProductsList),
    data: { permission: 'products:read' },
  },
  {
    path: 'maintenance/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/product-maintenance/product-maintenance').then(m => m.ProductMaintenance),
    data: { permission: 'products:update' },
  },
];
