import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const COUNTRY_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../components/countries-list/countries-list').then(m => m.CountriesList),
    data: { resource: 'countries/list' },
  },
  {
    path: 'create',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../components/countries-form/countries-form').then(m => m.CountriesForm),
    data: { resource: 'countries/create' },
  },
  {
    path: 'edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../components/countries-form/countries-form').then(m => m.CountriesForm),
    data: { resource: 'countries/update' },
  },
];
