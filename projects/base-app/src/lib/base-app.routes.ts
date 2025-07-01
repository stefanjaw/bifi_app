import { Routes } from '@angular/router';
import { MainMenu } from './common';
import { CompaniesList, SettingsMainMenu } from './settings';

export const baseAppRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: MainMenu },
  {
    path: 'settings',
    component: SettingsMainMenu,
    children: [
      {
        path: 'companies',
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'list',
          },
          {
            path: 'list',
            component: CompaniesList,
          },
        ],
      },
    ],
  },
];
