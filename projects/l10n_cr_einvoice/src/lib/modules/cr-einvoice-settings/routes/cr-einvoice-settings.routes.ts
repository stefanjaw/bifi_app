import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const CR_EINVOICE_SETTINGS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/cr-einvoice-settings-form/cr-einvoice-settings-form').then(
        m => m.CrEinvoiceSettingsForm
      ),
    data: { resource: 'cr-einvoice/settings' },
  },
];
