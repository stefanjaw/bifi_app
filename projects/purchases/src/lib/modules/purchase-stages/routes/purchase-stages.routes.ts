import { Routes } from '@angular/router';

export const PURCHASE_STAGES_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    loadComponent: () =>
      import('../features/purchase-stages-list/purchase-stages-list').then(m => m.PurchaseStagesList),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('../features/purchase-stages-form/purchase-stages-form').then(m => m.PurchaseStagesForm),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('../features/purchase-stages-form/purchase-stages-form').then(m => m.PurchaseStagesForm),
  },
];
