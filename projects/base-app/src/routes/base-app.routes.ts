import { Routes } from '@angular/router';
import { authGuard } from '@avalantec/base-app/auth';
import { MainMenu } from '@avalantec/base-app/core';

export const BASE_APP_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', canActivate: [authGuard], component: MainMenu },
];
