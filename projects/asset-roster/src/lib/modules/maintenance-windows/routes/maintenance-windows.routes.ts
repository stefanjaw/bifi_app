import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

export const MAINTENANCE_WINDOWS_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/maintenance-windows-list/maintenance-windows-list').then(
        m => m.MaintenanceWindowsList
      ),
    data: { resource: 'maintenance-windows/list' },
  },
  {
    path: 'create',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/maintenance-windows-form/maintenance-windows-form').then(
        m => m.MaintenanceWindowsForm
      ),
    data: { resource: 'maintenance-windows/create' },
  },
  {
    path: 'edit/:id',
    canActivate: [permissionGuard],
    loadComponent: () =>
      import('../features/maintenance-windows-form/maintenance-windows-form').then(
        m => m.MaintenanceWindowsForm
      ),
    data: { resource: 'maintenance-windows/update' },
  },
];
