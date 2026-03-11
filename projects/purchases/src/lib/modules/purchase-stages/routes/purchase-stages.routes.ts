import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const PURCHASE_STAGES_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/purchase-stages-list/purchase-stages-list').then(m => m.PurchaseStagesList),
    data: { resource: 'purchase-stages/list' },
  },
  {
    path: 'create',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/purchase-stages-form/purchase-stages-form').then(m => m.PurchaseStagesForm),
    data: { resource: 'purchase-stages/create' },
  },
  {
    path: 'edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/purchase-stages-form/purchase-stages-form').then(m => m.PurchaseStagesForm),
    data: { resource: 'purchase-stages/update' },
  },
];
