import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

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
    data: { permission: 'rooms:read' },
  },
];
