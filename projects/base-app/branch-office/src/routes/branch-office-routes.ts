import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const BRANCH_OFFICE_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../components/branch-offices-list/branch-offices-list').then(
        m => m.BranchOfficesList
      ),
    data: { resource: 'branch-offices/list' },
  },
  {
    path: 'create',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../components/branch-office-form/branch-office-form').then(m => m.BranchOfficeForm),
    data: { resource: 'branch-offices/create' },
  },
  {
    path: 'edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../components/branch-office-form/branch-office-form').then(m => m.BranchOfficeForm),
    data: { resource: 'branch-offices/update' },
  },
];
