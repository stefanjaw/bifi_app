import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const PRODUCT_TYPES_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/product-types-list/product-types-list').then(m => m.ProductTypesList),
    data: { permission: 'product-types:read' },
  },
  {
    path: 'create',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/product-types-form/product-types-form').then(m => m.ProductTypesForm),
    data: { permission: 'product-types:create' },
  },
  {
    path: 'edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/product-types-form/product-types-form').then(m => m.ProductTypesForm),
    data: { permission: 'product-types:update' },
  },
];
