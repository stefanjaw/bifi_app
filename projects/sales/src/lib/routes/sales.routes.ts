import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

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
    loadComponent: () =>
      import('../features/crm-form/crm-form').then(c => c.CrmFormComponent),
    data: { resource: 'sales/opportunities/create' },
  },
  {
    path: 'opportunities/edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/crm-form/crm-form').then(c => c.CrmFormComponent),
    data: { resource: 'sales/opportunities/update' },
  },
  {
    path: 'pipeline',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/sales-pipeline/sales-pipeline').then(c => c.SalesPipeline),
    data: { resource: 'sales/pipeline/list' },
  },
  {
    path: 'orders',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/orders-list/orders-list').then(c => c.OrdersList),
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
        loadComponent: () =>
          import('../features/targets/targets-list/targets-list').then(c => c.TargetsList),
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
