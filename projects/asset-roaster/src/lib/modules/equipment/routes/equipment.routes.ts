import { Routes } from '@angular/router';

export const EQUIPMENT_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    loadComponent: () =>
      import(
        '../features/equipment-list-page/equipment-list-page.component'
      ).then((m) => m.EquipmentListPageComponent),
  },
];
