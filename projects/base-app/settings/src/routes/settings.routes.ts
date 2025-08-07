import { Routes } from '@angular/router';
import { SettingsMainMenu } from '../components/settings-main-menu/settings-main-menu';
import { authGuard } from '@avalantec/base-app/auth';

export const settingsRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'contacts',
  },
  {
    path: 'companies',
    canActivate: [authGuard],
    component: SettingsMainMenu,
    loadChildren: () => import('../modules/companies').then(m => m.COMPANY_ROUTES),
  },
  {
    path: 'contacts',
    canActivate: [authGuard],
    component: SettingsMainMenu,
    loadChildren: () => import('../modules/contacts').then(m => m.CONTACT_ROUTES),
  },
];
