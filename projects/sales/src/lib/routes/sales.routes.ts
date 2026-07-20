import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';
import { DirtyFormGuard } from '@avalantec/base-app/form';

export const SALES_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'dashboard',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/sales-dashboard/sales-dashboard').then(c => c.SalesDashboard),
    data: { resource: 'sales/dashboard/list' },
  },
  {
    path: 'opportunities',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/opportunities-list/opportunities-list').then(c => c.OpportunitiesList),
    data: { resource: 'sales/opportunities/list' },
  },
  {
    path: 'opportunities/new',
    canActivate: [permissionGuard],
    canDeactivate: [DirtyFormGuard],
    loadComponent: () => import('../features/crm-form/crm-form').then(c => c.CrmsForm),
    data: { resource: 'sales/opportunities/create' },
  },
  {
    path: 'opportunities/edit/:id',
    canActivate: [permissionGuard],
    canDeactivate: [DirtyFormGuard],
    loadComponent: () => import('../features/crm-form/crm-form').then(c => c.CrmsForm),
    data: { resource: 'sales/opportunities/update' },
  },
  {
    path: 'pipeline',
    redirectTo: 'opportunities',
    pathMatch: 'full',
  },
  {
    path: 'orders',
    canActivate: [permissionGuard],
    loadComponent: () => import('../features/orders-list/orders-list').then(c => c.OrdersList),
    data: { resource: 'sales/orders/list' },
  },
  {
    path: 'orders/new',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/sales-order-detail/sales-order-detail').then(c => c.SalesOrderDetail),
    data: { resource: 'sales/orders/create' },
  },
  {
    path: 'orders/edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/sales-order-detail/sales-order-detail').then(c => c.SalesOrderDetail),
    data: { resource: 'sales/orders/update' },
  },
  {
    path: 'order-stages',
    canActivate: [permissionGuard],
    data: { resource: 'sales-order-stages/list' },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list',
      },
      {
        path: 'list',
        canActivate: [permissionGuard],
        loadComponent: () =>
          import('../modules/sales-order-stages/features/sales-order-stages-list/sales-order-stages-list').then(
            m => m.SalesOrderStagesList
          ),
        data: { resource: 'sales-order-stages/list' },
      },
      {
        path: 'create',
        canActivate: [permissionGuard],
        loadComponent: () =>
          import('../modules/sales-order-stages/features/sales-order-stages-form/sales-order-stages-form').then(
            m => m.SalesOrderStagesForm
          ),
        data: { resource: 'sales-order-stages/create' },
      },
      {
        path: 'edit/:id',
        canActivate: [permissionGuard],
        loadComponent: () =>
          import('../modules/sales-order-stages/features/sales-order-stages-form/sales-order-stages-form').then(
            m => m.SalesOrderStagesForm
          ),
        data: { resource: 'sales-order-stages/update' },
      },
    ],
  },
  {
    path: 'targets',
    canActivate: [permissionGuard],
    data: { resource: 'sales/targets/list' },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list',
      },
      {
        path: 'list',
        canActivate: [permissionGuard],
        loadComponent: () =>
          import('../features/targets/targets-list/targets-list').then(c => c.TargetsList),
        data: { resource: 'sales/targets/list' },
      },
      {
        path: 'create',
        canActivate: [permissionGuard],
        loadComponent: () =>
          import('../features/targets/targets-form/targets-form').then(c => c.TargetsForm),
        data: { resource: 'sales/targets/create' },
      },
      {
        path: 'edit/:id',
        canActivate: [permissionGuard],
        loadComponent: () =>
          import('../features/targets/targets-form/targets-form').then(c => c.TargetsForm),
        data: { resource: 'sales/targets/update' },
      },
    ],
  },
];
