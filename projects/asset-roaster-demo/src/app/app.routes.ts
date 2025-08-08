import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('@avalantec/base-app').then(m => m.BASE_APP_ROUTES),
  },
  {
    path: 'auth',
    loadChildren: () => import('@avalantec/base-app').then(m => m.AUTH_ROUTES),
  },
  {
    path: 'settings',
    loadChildren: () => import('@avalantec/base-app').then(m => m.SETTINGS_ROUTES),
  },
  {
    path: 'asset-roaster',
    loadChildren: () => import('@avalantec/asset-roaster').then(m => m.ASSET_ROASTER_ROUTES),
  },
];
