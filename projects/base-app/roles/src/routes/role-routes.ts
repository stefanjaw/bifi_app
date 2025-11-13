import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const ROLE_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    canActivate: [permissionGuard],
    loadComponent: () => import('../components/roles-list/roles-list').then(m => m.RolesList),
    data: { resource: 'roles/list' },
  },
  {
    path: 'create',
    canActivate: [permissionGuard],
    loadComponent: () => import('../components/roles-form/roles-form').then(m => m.RolesForm),
    data: { resource: 'roles/create' },
  },
  {
    path: 'edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () => import('../components/roles-form/roles-form').then(m => m.RolesForm),
    data: { resource: 'roles/update' },
  },
];
