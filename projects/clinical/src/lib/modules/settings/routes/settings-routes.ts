import { Routes } from '@angular/router';
import { permissionGuard } from '@avalantec/base-app/auth';

/** Settings feature routes for genders */
export const GENDERS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [permissionGuard],
    data: { resource: 'genders/list' },
    loadComponent: () => import('../features/genders-list/genders-list').then(m => m.GendersList),
  },
];

/** Settings feature routes for marital statuses */
export const MARITAL_STATUSES_ROUTES: Routes = [
  {
    path: '',
    canActivate: [permissionGuard],
    data: { resource: 'marital-statuses/list' },
    loadComponent: () =>
      import('../features/marital-statuses-list/marital-statuses-list').then(
        m => m.MaritalStatusesList
      ),
  },
];

/** Settings feature routes for admission types */
export const ADMISSION_TYPES_ROUTES: Routes = [
  {
    path: '',
    canActivate: [permissionGuard],
    data: { resource: 'admission-types/list' },
    loadComponent: () =>
      import('../features/admission-types-list/admission-types-list').then(
        m => m.AdmissionTypesList
      ),
  },
];

/** Settings feature routes for care continuum levels */
export const CARE_CONTINUUM_LEVELS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [permissionGuard],
    data: { resource: 'care-continuum-levels/list' },
    loadComponent: () =>
      import('../features/care-continuum-levels-list/care-continuum-levels-list').then(
        m => m.CareContinuumLevelsList
      ),
  },
];

/** Settings feature routes for races */
export const RACES_ROUTES: Routes = [
  {
    path: '',
    canActivate: [permissionGuard],
    data: { resource: 'races/list' },
    loadComponent: () => import('../features/races-list/races-list').then(m => m.RacesList),
  },
];

/** Settings feature routes for medical allergies */
export const MEDICAL_ALLERGIES_ROUTES: Routes = [
  {
    path: '',
    canActivate: [permissionGuard],
    data: { resource: 'medical-allergies/list' },
    loadComponent: () =>
      import('../features/medical-allergies-list/medical-allergies-list').then(
        m => m.MedicalAllergiesList
      ),
  },
];

/** Settings feature routes for medical precautions */
export const MEDICAL_PRECAUTIONS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [permissionGuard],
    data: { resource: 'medical-precautions/list' },
    loadComponent: () =>
      import('../features/medical-precautions-list/medical-precautions-list').then(
        m => m.MedicalPrecautionsList
      ),
  },
];

/** Settings feature routes for contact labels */
export const CONTACT_LABELS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [permissionGuard],
    data: { resource: 'contact-labels/list' },
    loadComponent: () =>
      import('../features/contact-labels-list/contact-labels-list').then(m => m.ContactLabelsList),
  },
];
