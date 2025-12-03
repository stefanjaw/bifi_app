import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const TEMPLATE_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../components/templates-list/templates-list').then(m => m.TemplatesList),
    data: { resource: 'templates/list' },
  },
  {
    path: 'create',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../components/templates-form/templates-form').then(m => m.TemplatesForm),
    data: { resource: 'templates/create' },
  },
  {
    path: 'edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../components/templates-form/templates-form').then(m => m.TemplatesForm),
    data: { resource: 'templates/update' },
  },
];
