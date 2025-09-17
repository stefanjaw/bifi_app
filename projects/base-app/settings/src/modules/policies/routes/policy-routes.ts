import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const POLICY_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../components/policies-list/policies-list').then(m => m.PoliciesList),
    data: { permission: 'policies:read' },
  },
  {
    path: 'create',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../components/policies-form/policies-form').then(m => m.PoliciesForm),
    data: { permission: 'policies:create' },
  },
  {
    path: 'edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../components/policies-form/policies-form').then(m => m.PoliciesForm),
    data: { permission: 'policies:update' },
  },
];
