import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

/** Feature routes for vendors */
export const VENDORS_ROUTES: Routes = [
  {
    path: 'vendors',
    canActivate: [permissionGuard],
    data: { resource: 'vendors/list' },
    loadComponent: () => import('../features/vendors-list/vendors-list').then(m => m.VendorsList),
  },
];
