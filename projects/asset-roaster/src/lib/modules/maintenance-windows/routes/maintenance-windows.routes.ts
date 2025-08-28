import { Routes } from '@angular/router';
import { authGuard } from '@avalantec/base-app/auth';

export const MAINTENANCE_WINDOWS_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/maintenance-windows-list/maintenance-windows-list').then(
        m => m.MaintenanceWindowsList
      ),
  },
  {
    path: 'create',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/maintenance-windows-form/maintenance-windows-form').then(
        m => m.MaintenanceWindowsForm
      ),
  },
  {
    path: 'edit/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../features/maintenance-windows-form/maintenance-windows-form').then(
        m => m.MaintenanceWindowsForm
      ),
  },
];
