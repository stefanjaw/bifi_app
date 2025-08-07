import { Routes } from '@angular/router';
import { MainMenu } from '../components/main-menu/main-menu';
import { authGuard } from '@avalantec/base-app/auth';

export const baseAppRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', canActivate: [authGuard], component: MainMenu },
  {
    path: 'auth',
    loadChildren: () => import('@avalantec/base-app/auth').then(m => m.AUTH_ROUTES),
  },
];
