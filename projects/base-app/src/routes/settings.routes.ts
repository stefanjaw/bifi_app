import { authGuard } from '@avalantec/base-app/auth';
import { Routes } from '@angular/router';
import { SettingsMainMenu } from '../../settings/src/components/settings-main-menu/settings-main-menu';

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
    loadChildren: () =>
      import('../../settings/src/modules/companies/routes/company-routes').then(m => m.COMPANY_ROUTES),
  },
  {
    path: 'contacts',
    canActivate: [authGuard],
    component: SettingsMainMenu,
    loadChildren: () =>
      import('../../settings/src/modules/contacts/routes/contact-routes').then(m => m.CONTACT_ROUTES),
  },
  {
    path: 'users',
    canActivate: [authGuard],
    component: SettingsMainMenu,
    loadChildren: () => import('../../settings/src/modules/users/routes/user-routes').then(m => m.USER_ROUTES),
  },
  {
    path: 'roles',
    canActivate: [authGuard],
    component: SettingsMainMenu,
    loadChildren: () => import('../../settings/src/modules/roles/routes/role-routes').then(m => m.ROLE_ROUTES),
  },
  {
    path: 'policies',
    canActivate: [authGuard],
    component: SettingsMainMenu,
    loadChildren: () =>
      import('../../settings/src/modules/policies/routes/policy-routes').then(m => m.POLICY_ROUTES),
  },
];
