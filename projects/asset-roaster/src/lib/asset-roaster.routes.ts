import { Routes } from '@angular/router';

export const assetRoasterRoutes: Routes = [
  {
    path: 'equipment',
    loadChildren: () =>
      import('./modules/equipment/features/equipment.routes').then(
        (m) => m.EQUIPMENT_ROUTES,
      ),
  },
];
