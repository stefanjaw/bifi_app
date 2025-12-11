import { Routes } from '@angular/router';
import { authGuard } from '@avalantec/base-app/auth';

export const ASSET_ROASTER_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'equipment',
  },
  {
    path: 'equipment',
    canActivate: [authGuard],
    loadChildren: () => import('../modules/index').then(m => m.ASSET_ROSTER_ROUTES),
  },
];
