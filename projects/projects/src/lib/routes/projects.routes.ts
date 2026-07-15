import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const PROJECTS_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    canActivate: [permissionGuard],
    data: { resource: 'projects/list' },
    loadComponent: () =>
      import('../features/projects-list/projects-list').then(c => c.ProjectsList),
  },
  {
    path: 'create',
    canActivate: [permissionGuard],
    data: { resource: 'projects/create' },
    loadComponent: () => import('../features/project-form/project-form').then(c => c.ProjectsForm),
  },
  {
    path: 'edit/:id',
    canActivate: [permissionGuard],
    data: { resource: 'projects/update' },
    loadComponent: () => import('../features/project-form/project-form').then(c => c.ProjectsForm),
  },
];
