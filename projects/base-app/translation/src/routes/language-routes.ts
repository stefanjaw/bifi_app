import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

/** Routes for Language record CRUD under /settings/languages */
export const LANGUAGE_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../components/languages-list/languages-list').then(m => m.LanguagesList),
    data: { resource: 'languages/list' },
  },
  {
    path: 'create',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../components/languages-form/languages-form').then(m => m.LanguagesForm),
    data: { resource: 'languages/create' },
  },
  {
    path: 'edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../components/languages-form/languages-form').then(m => m.LanguagesForm),
    data: { resource: 'languages/update' },
  },
];
