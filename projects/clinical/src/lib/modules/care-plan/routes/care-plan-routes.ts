import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

/** Care plan feature routes */
export const CARE_PLAN_ROUTES: Routes = [
  {
    path: 'admission-goals',
    canActivate: [permissionGuard],
    data: { resource: 'admission-goals/list' },
    loadComponent: () =>
      import('../features/admission-goals-list/admission-goals-list').then(
        m => m.AdmissionGoalsList
      ),
  },
  {
    path: 'admission-goals/create',
    canActivate: [permissionGuard],
    data: { resource: 'admission-goals/create' },
    loadComponent: () =>
      import('../features/admission-goal-form/admission-goal-form').then(
        m => m.AdmissionGoalsFormPage
      ),
  },
  {
    path: 'admission-goals/:id',
    canActivate: [permissionGuard],
    data: { resource: 'admission-goals/update' },
    loadComponent: () =>
      import('../features/admission-goal-form/admission-goal-form').then(
        m => m.AdmissionGoalsFormPage
      ),
  },
  {
    path: 'interventions',
    canActivate: [permissionGuard],
    data: { resource: 'interventions/list' },
    loadComponent: () =>
      import('../features/interventions-list/interventions-list').then(m => m.InterventionsList),
  },
  {
    path: 'outcomes',
    canActivate: [permissionGuard],
    data: { resource: 'outcomes/list' },
    loadComponent: () =>
      import('../features/outcomes-list/outcomes-list').then(m => m.OutcomesList),
  },
];
