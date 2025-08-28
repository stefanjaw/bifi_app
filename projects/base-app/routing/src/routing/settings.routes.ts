import { authGuard } from '@avalantec/base-app/auth';
import { Routes } from '@angular/router';
import { SettingsMainMenu } from '../components/settings-main-menu/settings-main-menu';

export const SETTINGS_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'contacts',
  },
  {
    path: 'companies',
    canActivate: [authGuard],
    component: SettingsMainMenu,
    loadChildren: () => import('@avalantec/base-app/settings').then(m => m.COMPANY_ROUTES),
  },
  {
    path: 'contacts',
    canActivate: [authGuard],
    component: SettingsMainMenu,
    loadChildren: () => import('@avalantec/base-app/settings').then(m => m.CONTACT_ROUTES),
  },
  {
    path: 'users',
    canActivate: [authGuard],
    component: SettingsMainMenu,
    loadChildren: () => import('@avalantec/base-app/settings').then(m => m.USER_ROUTES),
  },
  {
    path: 'roles',
    canActivate: [authGuard],
    component: SettingsMainMenu,
    loadChildren: () => import('@avalantec/base-app/settings').then(m => m.ROLE_ROUTES),
  },
  {
    path: 'policies',
    canActivate: [authGuard],
    component: SettingsMainMenu,
    loadChildren: () => import('@avalantec/base-app/settings').then(m => m.POLICY_ROUTES),
  },
];
