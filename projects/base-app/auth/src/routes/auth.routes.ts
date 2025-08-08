import type { Routes } from '@angular/router';
import { noAuthGuard } from '../guards/no-auth-guard';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'signin',
  },
  {
    path: 'signin',
    canActivate: [noAuthGuard],
    loadComponent: () => import('../features/auth-page/auth-page').then(m => m.AuthPage),
    data: { isLogin: true },
  },
  {
    path: 'signup',
    canActivate: [noAuthGuard],
    loadComponent: () => import('../features/auth-page/auth-page').then(m => m.AuthPage),
    data: { isLogin: false },
  },
];
