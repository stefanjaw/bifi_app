import { Route, Routes } from '@angular/router';

export const EQUIPMENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./equipment-list-page/equipment-list-page.component').then(
        (m) => m.EquipmentListPageComponent,
      ),
  },
];
