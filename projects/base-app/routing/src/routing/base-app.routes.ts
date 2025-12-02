import { Routes } from '@angular/router';
import { authGuard, noAuthGuard } from '@avalantec/base-app/auth';
import { SETTINGS_ROUTES } from './settings.routes';
import { CONTACT_ROUTES } from '@avalantec/base-app/contacts';
import { AUTH_ROUTES } from './auth.routes';
import { WEBSITE_ROUTES } from '@avalantec/base-app/website';

// * Routes outside of the base app will be loaded in the corresponding library
export const BASE_APP_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'website',
    canActivate: [noAuthGuard],
    children: WEBSITE_ROUTES,
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('../components/main-menu/main-menu').then(m => m.MainMenu),
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    children: SETTINGS_ROUTES,
  },
  {
    path: 'contacts',
    canActivate: [authGuard],
    children: CONTACT_ROUTES,
  },
  {
    path: 'auth',
    children: AUTH_ROUTES,
  },
];
