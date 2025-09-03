import { Routes } from '@angular/router';

export const MAINTENANCE_WINDOWS_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list',
  },
  {
    path: 'list',
    loadComponent: () =>
      import('../features/maintenance-windows-list/maintenance-windows-list').then(
        m => m.MaintenanceWindowsList
      ),
  },
  {
    path: 'create',
    loadComponent: () =>
      import('../features/maintenance-windows-form/maintenance-windows-form').then(
        m => m.MaintenanceWindowsForm
      ),
  },
  {
    path: 'edit/:id',
    loadComponent: () =>
      import('../features/maintenance-windows-form/maintenance-windows-form').then(
        m => m.MaintenanceWindowsForm
      ),
  },
];
