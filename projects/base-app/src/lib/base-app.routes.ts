import { Routes } from '@angular/router';
import { MainMenu } from './common';
import { SettingsMainMenu } from './settings';

export const baseAppRoutes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: MainMenu },
  { path: 'settings', component: SettingsMainMenu },
];
