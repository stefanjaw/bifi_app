import { Routes } from '@angular/router';
import { MainMenu } from './system';
import { CompaniesList, SettingsMainMenu, UsersList } from './settings';

export const baseAppRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: MainMenu },
  {
    path: 'settings',
    component: SettingsMainMenu,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'contacts',
      },
      {
        path: 'companies',
        loadChildren: () => import('./settings').then((m) => m.COMPANY_ROUTES),
      },
      {
        path: 'contacts',
        loadChildren: () => import('./settings').then((m) => m.CONTACT_ROUTES),
      },
    ],
  },
];
