import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const SHIPPINGS_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/shippings-list/shippings-list').then(m => m.ShippingsList),
    data: { resource: 'shippings/list' },
  },
  {
    path: 'edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/shippings-form/shippings-form').then(m => m.ShippingsForm),
    data: { resource: 'shippings/form' },
  },
  {
    path: 'bcd',
    canActivate: [permissionGuard],
    loadChildren: () => import('../../bcds').then(m => m.BCD_ROUTES),
    data: { resource: 'bcds/list' },
  },
];
