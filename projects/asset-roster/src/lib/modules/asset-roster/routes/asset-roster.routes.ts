import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const ASSET_ROSTER_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/asset-roster-list/asset-roster-list').then(m => m.AssetRosterList),
    data: { resource: 'asset-rosters/list' },
  },
  {
    path: 'maintenance/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/asset-roster-maintenance/asset-roster-maintenance').then(
        m => m.AssetRosterMaintenance
      ),
    data: { resource: 'asset-rosters/update' },
  },
];
