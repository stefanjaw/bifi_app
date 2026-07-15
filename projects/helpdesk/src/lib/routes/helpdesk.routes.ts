import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const HELPDESK_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    canActivate: [permissionGuard],
    data: { resource: 'tickets/list' },
    loadComponent: () => import('../features/ticket-list/ticket-list').then(c => c.TicketList),
  },
  {
    path: 'create',
    canActivate: [permissionGuard],
    data: { resource: 'tickets/create' },
    loadComponent: () => import('../features/ticket-form/ticket-form').then(c => c.TicketsForm),
  },
  {
    path: 'edit/:id',
    canActivate: [permissionGuard],
    data: { resource: 'tickets/update' },
    loadComponent: () => import('../features/ticket-form/ticket-form').then(c => c.TicketsForm),
  },
  {
    path: 'report',
    canActivate: [permissionGuard],
    data: { resource: 'tickets/report' },
    loadComponent: () =>
      import('../features/helpdesk-report/helpdesk-report').then(c => c.HelpdeskReport),
  },
];
