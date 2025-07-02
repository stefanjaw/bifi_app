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
        redirectTo: 'users',
      },
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
      {
        path: 'users',
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'list',
          },
          {
            path: 'list',
            component: UsersList,
          },
        ],
      },
    ],
  },
];
