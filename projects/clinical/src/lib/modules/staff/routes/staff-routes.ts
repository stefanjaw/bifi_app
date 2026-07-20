import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

/** Feature routes for staff, staff groups, shifts, and shift dashboard */
export const STAFF_ROUTES: Routes = [
  {
    path: 'staff',
    canActivate: [permissionGuard],
    data: { resource: 'staff/list' },
    loadComponent: () => import('../features/staff-list/staff-list').then(m => m.StaffList),
  },
  {
    path: 'staff-groups',
    canActivate: [permissionGuard],
    data: { resource: 'staff-groups/list' },
    loadComponent: () =>
      import('../features/staff-groups-list/staff-groups-list').then(m => m.StaffGroupsList),
  },
  {
    path: 'shifts',
    canActivate: [permissionGuard],
    data: { resource: 'shifts/list' },
    loadComponent: () => import('../features/shifts-list/shifts-list').then(m => m.ShiftsList),
  },
  {
    path: 'shift-dashboard',
    canActivate: [permissionGuard],
    data: { resource: 'shift-dashboard/view' },
    loadComponent: () =>
      import('../features/shift-dashboard/shift-dashboard').then(m => m.ShiftDashboard),
  },
];
