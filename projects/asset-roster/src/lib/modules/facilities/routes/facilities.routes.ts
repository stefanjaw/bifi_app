import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';
import { DirtyFormGuard } from '@avalantec/base-app/form';

export const FACILITIES_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/facilities-list/facilities-list').then(m => m.FacilitiesList),
    data: { resource: 'facilities/list' },
  },
  {
    path: 'create',
    canActivate: [permissionGuard],
    canDeactivate: [DirtyFormGuard],
    loadComponent: () =>
      import('../features/facilities-form/facilities-form').then(m => m.FacilitiesForm),
    data: { resource: 'facilities/create' },
  },
  {
    path: 'edit/:id',
    canActivate: [permissionGuard],
    canDeactivate: [DirtyFormGuard],
    loadComponent: () =>
      import('../features/facilities-form/facilities-form').then(m => m.FacilitiesForm),
    data: { resource: 'facilities/update' },
  },
];
