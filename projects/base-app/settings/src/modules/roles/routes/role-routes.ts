import { Routes } from '@angular/router';

export const ROLE_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    loadComponent: () => import('../components/roles-list/roles-list').then(m => m.RolesList),
  },
  {
    path: 'create',
    loadComponent: () => import('../components/roles-form/roles-form').then(m => m.RolesForm),
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('../components/roles-form/roles-form').then(m => m.RolesForm),
  },
];
