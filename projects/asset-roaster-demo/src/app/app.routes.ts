import { Routes } from '@angular/router';
import { baseAppRoutes } from 'base-app';
import { assetRoasterRoutes } from 'asset-roaster';

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
