import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

/** Care continuum feature routes */
export const CARE_CONTINUUM_ROUTES: Routes = [
  {
    path: '',
    canActivate: [permissionGuard],
    data: { resource: 'care-continuums/list' },
    loadComponent: () =>
      import('../features/care-continuum-list/care-continuum-list').then(m => m.CareContinuumList),
  },
  {
    path: 'create',
    canActivate: [permissionGuard],
    data: { resource: 'care-continuums/create' },
    loadComponent: () =>
      import('../features/care-continuum-form/care-continuum-form').then(
        m => m.CareContinuumsFormPage
      ),
  },
  {
    path: ':id',
    canActivate: [permissionGuard],
    data: { resource: 'care-continuums/update' },
    loadComponent: () =>
      import('../features/care-continuum-form/care-continuum-form').then(
        m => m.CareContinuumsFormPage
      ),
  },
];
