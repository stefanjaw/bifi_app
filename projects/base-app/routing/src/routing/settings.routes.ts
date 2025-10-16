import { authGuard } from '@avalantec/base-app/auth';
import { Routes } from '@angular/router';

export const SETTINGS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('../components/settings-main-menu/settings-main-menu').then(m => m.SettingsMainMenu),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'companies',
      },
      {
        path: 'companies',
        loadChildren: () => import('@avalantec/base-app/companies').then(m => m.COMPANY_ROUTES),
      },
      {
        path: 'users',
        loadChildren: () => import('@avalantec/base-app/users').then(m => m.USER_ROUTES),
      },
      {
        path: 'roles',
        loadChildren: () => import('@avalantec/base-app/roles').then(m => m.ROLE_ROUTES),
      },
      {
        path: 'policies',
        loadChildren: () => import('@avalantec/base-app/policies').then(m => m.POLICY_ROUTES),
      },
      {
        path: 'countries',
        loadChildren: () => import('@avalantec/base-app/countries').then(m => m.COUNTRY_ROUTES),
      },
    ],
  },
];
