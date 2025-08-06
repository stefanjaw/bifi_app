import { Routes } from '@angular/router';

export const assetRoasterRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'equipment',
  },
  {
    path: 'equipment',
    loadChildren: () => import('./modules/index').then(m => m.PRODUCT_ROUTES),
  },
];
