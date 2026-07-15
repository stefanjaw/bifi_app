import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const SALES_CONFIGURATION_ROUTES: Routes = [
  {
    path: '',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/sales-settings-form/sales-settings-form').then(m => m.SalesSettingsPage),
    data: { resource: 'sales/settings' },
  },
];
