import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const SEQUENCE_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../components/sequences-list/sequences-list').then(m => m.SequencesList),
    data: { resource: 'sequences/list' },
  },
  {
    path: 'create',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../components/sequence-form/sequence-form').then(m => m.SequencesForm),
    data: { resource: 'sequences/create' },
  },
  {
    path: 'edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../components/sequence-form/sequence-form').then(m => m.SequencesForm),
    data: { resource: 'sequences/update' },
  },
];
