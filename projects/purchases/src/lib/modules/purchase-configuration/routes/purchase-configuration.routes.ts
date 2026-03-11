import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const PURCHASE_CONFIGURATION_ROUTES: Routes = [
  {
    path: '',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/purchase-settings-form/purchase-settings-form').then(
        m => m.PurchaseSettingsFormComponent
      ),
    data: { resource: 'purchases/settings' },
  },
];
