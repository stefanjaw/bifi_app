import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

/** Routes for Translation record CRUD under /settings/translations */
export const TRANSLATION_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../components/translations-list/translations-list').then(m => m.TranslationsList),
    data: { resource: 'translations/list' },
  },
  {
    path: 'create',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../components/translations-form/translations-form').then(m => m.TranslationsForm),
    data: { resource: 'translations/create' },
  },
  {
    path: 'edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../components/translations-form/translations-form').then(m => m.TranslationsForm),
    data: { resource: 'translations/update' },
  },
];
