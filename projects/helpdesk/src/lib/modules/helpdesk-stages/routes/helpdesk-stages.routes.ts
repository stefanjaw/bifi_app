import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const HELPDESK_STAGES_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/helpdesk-stages-list/helpdesk-stages-list').then(
        m => m.HelpdeskStagesList
      ),
    data: { resource: 'helpdesk-stages/list' },
  },
  {
    path: 'create',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/helpdesk-stages-form/helpdesk-stages-form').then(
        m => m.HelpdeskStagesForm
      ),
    data: { resource: 'helpdesk-stages/create' },
  },
  {
    path: 'edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/helpdesk-stages-form/helpdesk-stages-form').then(
        m => m.HelpdeskStagesForm
      ),
    data: { resource: 'helpdesk-stages/update' },
  },
];
