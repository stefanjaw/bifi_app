import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const TASK_TYPES_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/task-types-list/task-types-list').then(m => m.TaskTypesList),
    data: { resource: 'task-types/list' },
  },
  {
    path: 'create',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/task-types-form/task-types-form').then(m => m.TaskTypesForm),
    data: { resource: 'task-types/create' },
  },
  {
    path: 'edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/task-types-form/task-types-form').then(m => m.TaskTypesForm),
    data: { resource: 'task-types/update' },
  },
];
