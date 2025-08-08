import { authGuard } from '@avalantec/base-app/auth';
import { Routes } from '@angular/router';
import { SettingsMainMenu } from '@avalantec/base-app/settings';

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
];
