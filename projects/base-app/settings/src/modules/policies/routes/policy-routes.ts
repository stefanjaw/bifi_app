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
  {
    path: 'create',
    loadComponent: () =>
      import('../components/policies-form/policies-form').then(m => m.PoliciesForm),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('../components/policies-form/policies-form').then(m => m.PoliciesForm),
  },
];
