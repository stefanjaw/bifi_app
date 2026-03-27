import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const PROJECT_STAGES_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/project-stages-list/project-stages-list').then(
        m => m.ProjectStagesList
      ),
    data: { resource: 'project-stages/list' },
  },
  {
    path: 'create',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/project-stages-form/project-stages-form').then(
        m => m.ProjectStagesForm
      ),
    data: { resource: 'project-stages/create' },
  },
  {
    path: 'edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/project-stages-form/project-stages-form').then(
        m => m.ProjectStagesForm
      ),
    data: { resource: 'project-stages/update' },
  },
];
