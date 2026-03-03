import { Routes } from '@angular/router';
import { authGuard } from '@avalantec/base-app/auth';

export const SALES_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/sales-dashboard/sales-dashboard').then(c => c.SalesDashboard),
  },
  {
    path: 'opportunities',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/opportunities-list/opportunities-list').then(c => c.OpportunitiesList),
  },
  {
    path: 'opportunities/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/crm-form/crm-form').then(c => c.CrmFormComponent),
  },
  {
    path: 'opportunities/edit/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/crm-form/crm-form').then(c => c.CrmFormComponent),
  },
  {
    path: 'pipeline',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/sales-pipeline/sales-pipeline').then(c => c.SalesPipeline),
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/orders-list/orders-list').then(c => c.OrdersList),
  },
  {
    path: 'targets',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list',
      },
      {
        path: 'list',
        loadComponent: () =>
          import('../features/targets/targets-list/targets-list').then(c => c.TargetsList),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('../features/targets/targets-form/targets-form').then(c => c.TargetsForm),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('../features/targets/targets-form/targets-form').then(c => c.TargetsForm),
      },
    ],
  },
];
