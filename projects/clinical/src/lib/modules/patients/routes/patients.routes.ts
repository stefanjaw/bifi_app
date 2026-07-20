import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

/** Feature routes for patients */
export const PATIENTS_ROUTES: Routes = [
  {
    path: 'patients',
    canActivate: [permissionGuard],
    data: { resource: 'patients/list' },
    loadComponent: () =>
      import('../features/patients-list/patients-list').then(m => m.PatientsList),
  },
  {
    path: 'patient/:patientId',
    loadComponent: () =>
      import('../features/patients-form/patients-form').then(m => m.PatientsForm),
    canActivate: [permissionGuard],
    data: { resource: 'patients/read' },
    children: [
      {
        path: '',
        redirectTo: 'summary',
        pathMatch: 'full',
      },
      {
        path: 'summary',
        canActivate: [permissionGuard],
        data: { resource: 'patients/read' },
        loadComponent: () =>
          import('../features/patient-summary/patient-summary').then(m => m.PatientSummary),
      },
      {
        path: 'care-continuum/list',
        canActivate: [permissionGuard],
        data: { resource: 'care-continuums/list' },
        loadComponent: () =>
          import('../../care-continuum/features/care-continuum-list/care-continuum-list').then(
            m => m.CareContinuumList
          ),
      },
      {
        path: 'care-continuum/new',
        canActivate: [permissionGuard],
        data: { resource: 'care-continuums/create' },
        loadComponent: () =>
          import('../../care-continuum/features/care-continuum-form/care-continuum-form').then(
            m => m.CareContinuumsFormPage
          ),
      },
      {
        path: 'care-continuum/:ccId',
        canActivate: [permissionGuard],
        data: { resource: 'care-continuums/update' },
        loadComponent: () =>
          import('../../care-continuum/features/care-continuum-form/care-continuum-form').then(
            m => m.CareContinuumsFormPage
          ),
      },
      {
        path: 'order/list',
        canActivate: [permissionGuard],
        data: { resource: 'orders/list' },
        loadComponent: () =>
          import('../../clinical-orders/features/orders-list/orders-list').then(m => m.OrdersList),
      },
      {
        path: 'order/new',
        canActivate: [permissionGuard],
        data: { resource: 'orders/create' },
        loadComponent: () =>
          import('../../clinical-orders/features/orders-list/orders-list').then(m => m.OrdersList),
      },
      {
        path: 'order/:orderId',
        canActivate: [permissionGuard],
        data: { resource: 'orders/read' },
        loadComponent: () =>
          import('../../clinical-orders/features/orders-list/orders-list').then(m => m.OrdersList),
      },
      {
        path: 'order/results/:id',
        canActivate: [permissionGuard],
        data: { resource: 'orders/read' },
        loadComponent: () =>
          import('../../clinical-orders/features/orders-list/orders-list').then(m => m.OrdersList),
      },
      {
        path: 'care-plan/list',
        canActivate: [permissionGuard],
        data: { resource: 'care-plan/list' },
        loadComponent: () =>
          import('../features/patient-care-plan/patient-care-plan').then(m => m.PatientCarePlan),
      },
      {
        path: 'progress-note/list',
        canActivate: [permissionGuard],
        data: { resource: 'progress-notes/list' },
        loadComponent: () =>
          import('../../progress-notes/features/progress-notes-list/progress-notes-list').then(
            m => m.ProgressNotesList
          ),
      },
      {
        path: 'progress-note/:noteId',
        canActivate: [permissionGuard],
        data: { resource: 'progress-notes/update' },
        loadComponent: () =>
          import('../../progress-notes/features/progress-notes-list/progress-notes-list').then(
            m => m.ProgressNotesList
          ),
      },
      {
        path: 'vital-signs/list',
        canActivate: [permissionGuard],
        data: { resource: 'vital-signs/list' },
        loadComponent: () =>
          import('../../vital-signs/features/vital-signs-list/vital-signs-list').then(
            m => m.VitalSignsList
          ),
      },
      {
        path: 'fluid-track/intakeoutput',
        canActivate: [permissionGuard],
        data: { resource: 'fluid-tracks/read' },
        loadComponent: () =>
          import('../features/patient-fluid-balance/patient-fluid-balance').then(
            m => m.PatientFluidBalance
          ),
      },
      {
        path: 'tasks/list',
        canActivate: [permissionGuard],
        data: { resource: 'tasks/read' },
        loadComponent: () =>
          import('../features/patient-tasks/patient-tasks').then(m => m.PatientTasks),
      },
    ],
  },
];

/** @deprecated — use PATIENTS_ROUTES */
export const CLINICAL_ROUTES = PATIENTS_ROUTES;
