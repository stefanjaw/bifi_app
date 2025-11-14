import { Routes } from '@angular/router';

export const CRM_ROUTES: Routes = [
  {
    path: 'leads',
    loadComponent: () => import('../features/leads/leads').then(c => c.Leads),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'leads',
  },
];
