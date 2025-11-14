import { Routes } from '@angular/router';
import { authGuard } from '@avalantec/base-app/auth';

export const CALENDAR_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'view',
  },
  {
    path: 'view',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/calendar-screen/calendar-screen').then(m => m.CalendarScreen),
  },
];
