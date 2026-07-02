import { Routes } from '@angular/router';
import { authGuard } from '@avalantec/base-app/auth';

export const SETTINGS_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'companies',
  },
  {
    path: 'companies',
    canActivate: [authGuard],
    loadChildren: () => import('@avalantec/base-app/companies').then(m => m.COMPANY_ROUTES),
  },
  {
    path: 'users',
    canActivate: [authGuard],
    loadChildren: () => import('@avalantec/base-app/users').then(m => m.USER_ROUTES),
  },
  {
    path: 'roles',
    canActivate: [authGuard],
    loadChildren: () => import('@avalantec/base-app/roles').then(m => m.ROLE_ROUTES),
  },
  {
    path: 'policies',
    canActivate: [authGuard],
    loadChildren: () => import('@avalantec/base-app/policies').then(m => m.POLICY_ROUTES),
  },
  {
    path: 'countries',
    canActivate: [authGuard],
    loadChildren: () => import('@avalantec/base-app/countries').then(m => m.COUNTRY_ROUTES),
  },
  {
    path: 'reporting',
    canActivate: [authGuard],
    loadChildren: () => import('@avalantec/base-app/reporting').then(m => m.REPORTING_ROUTES),
  },
  {
    path: 'templates',
    canActivate: [authGuard],
    loadChildren: () => import('@avalantec/base-app/templates').then(m => m.TEMPLATE_ROUTES),
  },
  {
    path: 'currencies',
    canActivate: [authGuard],
    loadChildren: () => import('@avalantec/base-app/currency').then(m => m.CURRENCY_ROUTES),
  },
  {
    path: 'sequences',
    canActivate: [authGuard],
    loadChildren: () => import('@avalantec/base-app/sequences').then(m => m.SEQUENCE_ROUTES),
  },
  {
    path: 'search-destinations',
    canActivate: [authGuard],
    loadChildren: () =>
      import('@avalantec/base-app/search-destinations').then(m => m.SEARCH_DESTINATION_ROUTES),
  },
  {
    path: 'ai-settings',
    canActivate: [authGuard],
    loadChildren: () => import('@avalantec/base-app/ai-settings').then(m => m.AI_SETTINGS_ROUTES),
  },
  {
    path: 'drive-settings',
    canActivate: [authGuard],
    loadChildren: () =>
      import('@avalantec/base-app/drive-settings').then(m => m.DRIVE_SETTINGS_ROUTES),
  },
  {
    path: 'notification-settings',
    canActivate: [authGuard],
    loadChildren: () =>
      import('@avalantec/base-app/notification-settings').then(m => m.NOTIFICATION_SETTINGS_ROUTES),
  },
  {
    path: 'translations',
    canActivate: [authGuard],
    loadChildren: () => import('@avalantec/base-app/translation').then(m => m.TRANSLATION_ROUTES),
  },
  {
    path: 'languages',
    canActivate: [authGuard],
    loadChildren: () => import('@avalantec/base-app/translation').then(m => m.LANGUAGE_ROUTES),
  },
  {
    path: 'profile',
    loadComponent: () => import('@avalantec/base-app/users').then(m => m.UserProfile),
  },
];
