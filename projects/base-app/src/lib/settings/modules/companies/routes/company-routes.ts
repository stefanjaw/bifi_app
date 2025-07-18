import { Routes } from '@angular/router';

export const COMPANY_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    loadComponent: () =>
      import('../components/companies-list/companies-list').then(
        (m) => m.CompaniesList,
      ),
  },
];
