import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const CALENDAR_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'view',
  },
  {
    path: 'view',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/calendar-screen/calendar-screen').then(m => m.CalendarScreen),
    data: { resource: 'calendar/list' },
  },
];
