import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const CRM_ROUTES: Routes = [
  {
    path: 'leads',
    canActivate: [permissionGuard],
    loadComponent: () => import('../features/leads/leads').then(c => c.Leads),
    data: { resource: 'leads/list' },
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'leads',
  },
];
