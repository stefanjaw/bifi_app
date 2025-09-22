import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

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
    data: { permission: 'facilities:read' },
  },
  {
    path: 'create',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/facilities-form/facilities-form').then(m => m.FacilitiesForm),
    data: { permission: 'facilities:create' },
  },
  {
    path: 'edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/facilities-form/facilities-form').then(m => m.FacilitiesForm),
    data: { permission: 'facilities:update' },
  },
];
