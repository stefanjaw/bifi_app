import { Routes } from '@angular/router';
import { authGuard } from '@avalantec/base-app/auth';

export const CRM_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    canActivate: [authGuard],
    loadComponent: () => import('../features/crm-list/crm-list').then(c => c.CrmList),
  },
  {
    path: 'create',
    canActivate: [authGuard],
    loadComponent: () => import('../features/crm-form/crm-form').then(c => c.CrmFormComponent),
  },
  {
    path: 'edit/:id',
    canActivate: [authGuard],
    loadComponent: () => import('../features/crm-form/crm-form').then(c => c.CrmFormComponent),
  },
  {
    path: 'deals',
    canActivate: [authGuard],
    loadComponent: () => import('../features/deals-board/deals-board').then(c => c.DealsBoard),
  },
];
