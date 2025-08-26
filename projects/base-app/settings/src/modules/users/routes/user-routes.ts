import { Routes } from '@angular/router';

export const USER_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    loadComponent: () => import('../components/users-list/users-list').then(m => m.UsersList),
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('../components/users-form/users-form').then(m => m.UsersForm),
  },
];
