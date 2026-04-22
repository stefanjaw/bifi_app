import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const SALES_ORDER_STAGES_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/sales-order-stages-list/sales-order-stages-list').then(
        m => m.SalesOrderStagesList
      ),
    data: { resource: 'sales-order-stages/list' },
  },
  {
    path: 'create',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/sales-order-stages-form/sales-order-stages-form').then(
        m => m.SalesOrderStagesForm
      ),
    data: { resource: 'sales-order-stages/create' },
  },
  {
    path: 'edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/sales-order-stages-form/sales-order-stages-form').then(
        m => m.SalesOrderStagesForm
      ),
    data: { resource: 'sales-order-stages/update' },
  },
];
