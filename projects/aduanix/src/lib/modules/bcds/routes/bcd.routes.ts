import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const BCD_ROUTES: Routes = [
  {
    //create
    path: 'create/:shippingId',
    canActivate: [permissionGuard],
    loadComponent: () => import('../features/bcd-form/bcds-form').then(m => m.BcdsForm),
    data: { resource: 'bcds/create' },
  },
  {
    //edit
    path: 'edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () => import('../features/bcd-form/bcds-form').then(m => m.BcdsForm),
    data: { resource: 'bcds/update' },
  },
];
