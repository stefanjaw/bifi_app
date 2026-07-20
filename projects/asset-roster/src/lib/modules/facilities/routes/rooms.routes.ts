import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';
import { DirtyFormGuard } from '@avalantec/base-app/form';

export const ROOMS_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    canActivate: [permissionGuard],
    loadComponent: () => import('../features/rooms-list/rooms-list').then(m => m.RoomsList),
    data: { resource: 'rooms/list' },
  },
  {
    path: 'create',
    canActivate: [permissionGuard],
    canDeactivate: [DirtyFormGuard],
    loadComponent: () => import('../features/rooms-form/rooms-form').then(m => m.RoomsForm),
    data: { resource: 'rooms/create' },
  },
  {
    path: 'edit/:id',
    canActivate: [permissionGuard],
    canDeactivate: [DirtyFormGuard],
    loadComponent: () => import('../features/rooms-form/rooms-form').then(m => m.RoomsForm),
    data: { resource: 'rooms/update' },
  },
];
