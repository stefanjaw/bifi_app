import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

/** Feature routes for clinical tasks (recurrent tasks) */
export const CLINICAL_TASKS_ROUTES: Routes = [
  {
    path: 'recurrent-tasks',
    canActivate: [permissionGuard],
    data: { resource: 'recurrent-tasks/list' },
    loadComponent: () =>
      import('../features/recurrent-tasks-list/recurrent-tasks-list').then(
        m => m.RecurrentTasksList
      ),
  },
];
