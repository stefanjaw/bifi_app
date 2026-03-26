import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const TASK_STAGES_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/task-stages-list/task-stages-list').then(
        m => m.TaskStagesList
      ),
    data: { resource: 'task-stages/list' },
  },
  {
    path: 'create',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/task-stages-form/task-stages-form').then(
        m => m.TaskStagesForm
      ),
    data: { resource: 'task-stages/create' },
  },
  {
    path: 'edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/task-stages-form/task-stages-form').then(
        m => m.TaskStagesForm
      ),
    data: { resource: 'task-stages/update' },
  },
];
