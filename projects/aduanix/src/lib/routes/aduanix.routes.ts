import { Routes } from '@angular/router';
import { authGuard } from '@avalantec/base-app/auth';

export const ADUANIX_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'shippings',
  },
  {
    path: 'shippings',
    canActivate: [authGuard],
    loadChildren: () => import('../modules').then(m => m.SHIPPINGS_ROUTES),
  },
];
