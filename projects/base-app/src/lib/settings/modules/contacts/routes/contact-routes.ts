import { Routes } from '@angular/router';

export const CONTACT_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    loadComponent: () =>
      import('../components/contacts-list/contacts-list').then(
        (m) => m.ContactsList,
      ),
  },
];
