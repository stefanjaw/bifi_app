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
    path: 'edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () => import('../components/users-form/users-form').then(m => m.UsersForm),
    data: { permission: 'users:update' },
  },
];
