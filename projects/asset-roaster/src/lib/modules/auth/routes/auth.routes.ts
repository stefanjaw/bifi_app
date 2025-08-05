import type { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'signin',
  },
  {
    path: 'signin',
    loadComponent: () => import('../features/auth-page/auth-page').then(m => m.AuthPage),
    data: { isLogin: true },
  },
  {
    path: 'signup',
    loadComponent: () => import('../features/auth-page/auth-page').then(m => m.AuthPage),
    data: { isLogin: false },
  },
];
