import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const SHIPPINGS_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/shippings-list/shippings-list').then(m => m.ShippingsList),
    data: { resource: 'shippings/list' },
  },
  //   {
  //     path: 'maintenance/:id',
  //     canActivate: [permissionGuard],
  //     loadComponent: () =>
  //       import('../features/asset-roster-maintenance/asset-roster-maintenance').then(
  //         m => m.AssetRosterMaintenance
  //       ),
  //     data: { resource: 'asset-rosters/update' },
  //   },
];
