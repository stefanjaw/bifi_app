import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';
import { DirtyFormGuard } from '@avalantec/base-app/form';

/** Lazy routes for the Asset Conditions maintenance module. */
export const ASSET_CONDITIONS_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/asset-conditions-list/asset-conditions-list').then(
        m => m.AssetConditionsList
      ),
    data: { resource: 'asset-conditions/list' },
  },
  {
    path: 'create',
    canActivate: [permissionGuard],
    canDeactivate: [DirtyFormGuard],
    loadComponent: () =>
      import('../features/asset-conditions-form/asset-conditions-form').then(
        m => m.AssetConditionsForm
      ),
    data: { resource: 'asset-conditions/create' },
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'edit/:id',
    canActivate: [permissionGuard],
    canDeactivate: [DirtyFormGuard],
    loadComponent: () =>
      import('../features/asset-conditions-form/asset-conditions-form').then(
        m => m.AssetConditionsForm
      ),
    data: { resource: 'asset-conditions/update' },
    runGuardsAndResolvers: 'always',
  },
];
