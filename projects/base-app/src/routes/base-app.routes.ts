import { Routes } from '@angular/router';
import { authGuard } from '@avalantec/base-app/auth';

// * Routes outside of the base app will be loaded in the corresponding library
export const BASE_APP_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('@avalantec/base-app/core').then(m => m.MainMenu),
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadChildren: () => import('../routes/settings.routes').then(m => m.SETTINGS_ROUTES),
  },
  {
    path: 'auth',
    loadChildren: () => import('../routes/auth.routes').then(m => m.AUTH_ROUTES),
  },
];
