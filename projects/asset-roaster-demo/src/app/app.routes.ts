import { Routes } from '@angular/router';
import { baseAppRoutes } from '@avalantec/base-app';
import { assetRoasterRoutes } from '@avalantec/asset-roaster';

export const routes: Routes = [
  {
    path: '',
    children: baseAppRoutes,
  },
  {
    path: 'asset-roaster',
    children: assetRoasterRoutes,
  },
];
