import { Routes } from '@angular/router';

export const POLICY_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    loadComponent: () =>
      import('../components/policies-list/policies-list').then(m => m.PoliciesList),
  },
];
