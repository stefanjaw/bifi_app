import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const AI_SETTINGS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../components/ai-settings-form/ai-settings-form').then(
        m => m.AiSettingsFormComponent
      ),
    data: { resource: 'ai-settings' },
  },
];
