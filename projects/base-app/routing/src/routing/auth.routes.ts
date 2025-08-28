import type { Routes } from '@angular/router';
import { noAuthGuard } from '@avalantec/base-app/auth';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'signin',
  },
  {
    path: 'signin',
    canActivate: [noAuthGuard],
    loadComponent: () => import('@avalantec/base-app/auth').then(m => m.AuthPage),
    data: { isLogin: true },
  },
  {
    path: 'signup',
    canActivate: [noAuthGuard],
    loadComponent: () => import('@avalantec/base-app/auth').then(m => m.AuthPage),
    data: { isLogin: false },
  },
];
