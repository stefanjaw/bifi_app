import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';
import { DirtyFormGuard } from '@avalantec/base-app/form';

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
    canDeactivate: [DirtyFormGuard],
    loadComponent: () =>
      import('../features/asset-types-form/asset-types-form').then(m => m.AssetTypesForm),
    data: { resource: 'asset-types/create' },
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'edit/:id',
    canActivate: [permissionGuard],
    canDeactivate: [DirtyFormGuard],
    loadComponent: () =>
      import('../features/asset-types-form/asset-types-form').then(m => m.AssetTypesForm),
    data: { resource: 'asset-types/update' },
    runGuardsAndResolvers: 'always',
  },
];
