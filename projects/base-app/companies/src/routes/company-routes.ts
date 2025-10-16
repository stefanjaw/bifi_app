import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const COMPANY_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../components/companies-list/companies-list').then(m => m.CompaniesList),
    data: { permission: 'companies:read' },
  },
  {
    path: 'create',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../components/companies-form/companies-form').then(m => m.CompaniesForm),
    data: { permission: 'companies:create' },
  },
  {
    path: 'edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../components/companies-form/companies-form').then(m => m.CompaniesForm),
    data: { permission: 'companies:update' },
  },
];
