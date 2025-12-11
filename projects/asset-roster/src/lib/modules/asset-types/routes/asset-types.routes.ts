import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const ASSET_TYPES_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/asset-types-list/asset-types-list').then(m => m.AssetTypesList),
    data: { resource: 'asset-types/list' },
  },
  {
    path: 'create',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/asset-types-form/asset-types-form').then(m => m.AssetTypesForm),
    data: { resource: 'asset-types/create' },
  },
  {
    path: 'edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/asset-types-form/asset-types-form').then(m => m.AssetTypesForm),
    data: { resource: 'asset-types/update' },
  },
];
