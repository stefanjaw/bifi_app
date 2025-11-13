import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const CONTACT_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../components/contacts-list/contacts-list').then(m => m.ContactsList),
    data: { resource: 'contacts/list' },
  },
  {
    path: 'create',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../components/contacts-form/contacts-form').then(m => m.ContactsForm),
    data: { resource: 'contacts/create' },
  },
  {
    path: 'edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../components/contacts-form/contacts-form').then(m => m.ContactsForm),
    data: { resource: 'contacts/update' },
  },
];
