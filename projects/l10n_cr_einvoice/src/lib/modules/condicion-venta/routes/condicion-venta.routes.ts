import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const CONDICION_VENTA_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'list' },
  {
    path: 'list',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/condicion-venta-list/condicion-venta-list').then(m => m.CondicionVentaList),
    data: { resource: 'cr-einvoice/condicion-venta/list' },
  },
  {
    path: 'create',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/condicion-venta-form/condicion-venta-form').then(m => m.CondicionesVentaForm),
    data: { resource: 'cr-einvoice/condicion-venta/create' },
  },
  {
    path: 'edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/condicion-venta-form/condicion-venta-form').then(m => m.CondicionesVentaForm),
    data: { resource: 'cr-einvoice/condicion-venta/update' },
  },
];
