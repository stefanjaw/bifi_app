import { Routes } from '@angular/router';
import { authGuard } from '@avalantec/base-app/auth';

export const PROJECTS_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/projects-list/projects-list').then(c => c.ProjectsList),
  },
  {
    path: 'create',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/project-form/project-form').then(c => c.ProjectFormComponent),
  },
  {
    path: 'edit/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/project-form/project-form').then(c => c.ProjectFormComponent),
  },
];
