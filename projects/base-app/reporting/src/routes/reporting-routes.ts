import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const REPORTING_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../components/reportings-list/reportings-list').then(m => m.ReportingsList),
    data: { resource: 'reporting/list' },
  },
  {
    path: 'create',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../components/reportings-form/reportings-form').then(m => m.ReportingsForm),
    data: { resource: 'reporting/create' },
  },
  {
    path: 'edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../components/reportings-form/reportings-form').then(m => m.ReportingsForm),
    data: { resource: 'reporting/update' },
  },
];
