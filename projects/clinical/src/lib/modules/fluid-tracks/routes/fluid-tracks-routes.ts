import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

/** Feature routes for fluid tracks */
export const FLUID_TRACKS_ROUTES: Routes = [
  {
    path: 'fluid-tracks',
    canActivate: [permissionGuard],
    data: { resource: 'fluid-tracks/list' },
    loadComponent: () =>
      import('../features/fluid-tracks-list/fluid-tracks-list').then(m => m.FluidTracksList),
  },
];
