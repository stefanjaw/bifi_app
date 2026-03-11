import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const ACCOUNTING_CONFIGURATION_ROUTES: Routes = [
  {
    path: '',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/accounting-settings-form/accounting-settings-form').then(
        m => m.AccountingSettingsFormComponent
      ),
    data: { resource: 'accounting/settings' },
  },
];
