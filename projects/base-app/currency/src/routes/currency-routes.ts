import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const CURRENCY_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../components/currencies-list/currencies-list').then(m => m.CurrenciesList),
    data: { resource: 'currencies/list' },
  },
  {
    path: 'create',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../components/currency-form/currency-form').then(m => m.CurrencyForm),
    data: { resource: 'currencies/create' },
  },
  {
    path: 'edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../components/currency-form/currency-form').then(m => m.CurrencyForm),
    data: { resource: 'currencies/update' },
  },
  {
    path: 'exchange-rates',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list',
      },
      {
        path: 'list',
        canActivate: [permissionGuard],
        loadComponent: () =>
          import('../components/exchange-rates-list/exchange-rates-list').then(
            m => m.ExchangeRatesList
          ),
        data: { resource: 'exchange-rates/list' },
      },
      {
        path: 'create',
        canActivate: [permissionGuard],
        loadComponent: () =>
          import('../components/exchange-rate-form/exchange-rate-form').then(
            m => m.ExchangeRateForm
          ),
        data: { resource: 'exchange-rates/create' },
      },
      {
        path: 'edit/:id',
        canActivate: [permissionGuard],
        loadComponent: () =>
          import('../components/exchange-rate-form/exchange-rate-form').then(
            m => m.ExchangeRateForm
          ),
        data: { resource: 'exchange-rates/update' },
      },
    ],
  },
];
