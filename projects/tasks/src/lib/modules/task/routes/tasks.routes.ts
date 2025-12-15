import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const TASKS_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'view',
  },
  {
    path: 'view',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/tasks-main-view/tasks-main-view').then(m => m.TasksMainView),
    data: { resource: 'tasks/view' },
  },
];
