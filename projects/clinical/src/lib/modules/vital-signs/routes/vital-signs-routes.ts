import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

/** Feature routes for vital signs and vital sign types */
export const VITAL_SIGNS_ROUTES: Routes = [
  {
    path: 'vital-signs',
    canActivate: [permissionGuard],
    data: { resource: 'vital-signs/list' },
    loadComponent: () =>
      import('../features/vital-signs-list/vital-signs-list').then(m => m.VitalSignsList),
  },
  {
    path: 'vital-sign-types',
    canActivate: [permissionGuard],
    data: { resource: 'vital-sign-types/list' },
    loadComponent: () =>
      import('../features/vital-sign-types-list/vital-sign-types-list').then(
        m => m.VitalSignTypesList
      ),
  },
];
