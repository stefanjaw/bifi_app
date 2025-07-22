import { Routes } from '@angular/router';
import { assetRoasterRoutes } from '@avalantec/asset-roaster';
import { baseAppRoutes } from '@avalantec/base-app/core';
import { settingsRoutes } from '@avalantec/base-app/settings';

export const routes: Routes = [
  {
    path: '',
    children: baseAppRoutes,
  },
  {
    path: 'asset-roaster',
    children: assetRoasterRoutes,
  },
  {
    path: 'settings',
    children: settingsRoutes,
  },
];
