import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const USER_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    canActivate: [permissionGuard],
    loadComponent: () => import('../components/users-list/users-list').then(m => m.UsersList),
    data: { permission: 'users:read' },
  },
  {
    path: 'create',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../components/create-users-form/create-users-form').then(m => m.CreateUsersForm),
    data: { permission: 'users:create' },
  },
  {
    path: 'edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../components/update-users-form/update-users-form').then(m => m.UpdateUsersForm),
    data: { permission: 'users:update' },
  },
];
