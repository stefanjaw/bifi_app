import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

/** Feature routes for patients */
export const CLINICAL_ROUTES: Routes = [
  {
    path: 'patients',
    canActivate: [permissionGuard],
    data: { resource: 'patients/list' },
    loadComponent: () =>
      import('../features/patients-list/patients-list').then(m => m.PatientsList),
  },
];
