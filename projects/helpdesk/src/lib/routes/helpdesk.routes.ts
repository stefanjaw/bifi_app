import { Routes } from '@angular/router';
import { authGuard } from '@avalantec/base-app/auth';

export const HELPDESK_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/ticket-list/ticket-list').then(c => c.TicketList),
  },
  {
    path: 'create',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/ticket-form/ticket-form').then(c => c.TicketFormComponent),
  },
  {
    path: 'edit/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/ticket-form/ticket-form').then(c => c.TicketFormComponent),
  },
  {
    path: 'report',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/helpdesk-report/helpdesk-report').then(c => c.HelpdeskReport),
  },
];
