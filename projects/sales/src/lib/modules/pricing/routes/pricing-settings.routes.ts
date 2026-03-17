import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const PRICING_SETTINGS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/pricing-settings-form/pricing-settings-form').then(
        m => m.PricingSettingsFormComponent
      ),
    data: { resource: 'pricing-settings' },
  },
];
