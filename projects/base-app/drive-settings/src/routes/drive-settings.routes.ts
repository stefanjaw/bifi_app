import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const DRIVE_SETTINGS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../components/drive-settings-form/drive-settings-form').then(
        m => m.DriveSettingsFormComponent
      ),
    data: { resource: 'drive-settings' },
  },
];
