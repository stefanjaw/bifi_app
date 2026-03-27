import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const ADUANIX_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'shippings',
  },
  {
    path: 'shippings',
    canActivate: [permissionGuard],
    data: { resource: 'shippings/list' },
    loadChildren: () => import('../modules').then(m => m.SHIPPINGS_ROUTES),
  },
];
