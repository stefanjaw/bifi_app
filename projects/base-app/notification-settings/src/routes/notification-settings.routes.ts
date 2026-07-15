import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const NOTIFICATION_SETTINGS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../components/notification-settings-form/notification-settings-form').then(
        m => m.NotificationSettingsForm
      ),
    data: { resource: 'notification-settings' },
  },
];
