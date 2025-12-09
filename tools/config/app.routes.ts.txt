import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('@avalantec/base-app/routing').then(m => m.BASE_APP_ROUTES),
  },
];
