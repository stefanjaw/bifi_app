import { Routes } from '@angular/router';
import { authGuard } from '@avalantec/base-app/auth';

// * Routes outside of the base app will be loaded in the corresponding library
export const BASE_APP_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('../components/main-menu/main-menu').then(m => m.MainMenu),
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadChildren: () => import('./settings.routes').then(m => m.SETTINGS_ROUTES),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth.routes').then(m => m.AUTH_ROUTES),
  },
];
