import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const MEDIO_PAGO_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'list' },
  {
    path: 'list',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/medio-pago-list/medio-pago-list').then(m => m.MedioPagoList),
    data: { resource: 'cr-einvoice/medio-pago/list' },
  },
  {
    path: 'create',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/medio-pago-form/medio-pago-form').then(m => m.MedioPagoForm),
    data: { resource: 'cr-einvoice/medio-pago/create' },
  },
  {
    path: 'edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/medio-pago-form/medio-pago-form').then(m => m.MedioPagoForm),
    data: { resource: 'cr-einvoice/medio-pago/update' },
  },
];
