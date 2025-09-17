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
    data: { permission: 'contacts:read' },
  },
];
