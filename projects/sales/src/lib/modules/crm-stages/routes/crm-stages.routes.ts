import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';
import { DirtyFormGuard } from '@avalantec/base-app/form';

export const CRM_STAGES_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/crm-stages-list/crm-stages-list').then(m => m.CrmStagesList),
    data: { resource: 'crm-stages/list' },
  },
  {
    path: 'create',
    canActivate: [permissionGuard],
    canDeactivate: [DirtyFormGuard],
    loadComponent: () =>
      import('../features/crm-stages-form/crm-stages-form').then(m => m.CrmStagesForm),
    data: { resource: 'crm-stages/create' },
  },
  {
    path: 'edit/:id',
    canActivate: [permissionGuard],
    canDeactivate: [DirtyFormGuard],
    loadComponent: () =>
      import('../features/crm-stages-form/crm-stages-form').then(m => m.CrmStagesForm),
    data: { resource: 'crm-stages/update' },
  },
];
