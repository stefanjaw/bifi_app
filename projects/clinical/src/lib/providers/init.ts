import { inject } from '@angular/core';
import { MainMenuManager, MainRoutingManager } from '@avalantec/base-app/routing';
import { PrimeIcons } from 'primeng/api';
import { CLINICAL_ROUTES } from '../modules/patients/routes/patients.routes';
import { CARE_CONTINUUM_ROUTES } from '../modules/care-continuum/routes/care-continuum-routes';
import { CARE_PLAN_ROUTES } from '../modules/care-plan/routes/care-plan-routes';
import { CLINICAL_ORDERS_ROUTES } from '../modules/clinical-orders/routes/clinical-orders-routes';
import { PROGRESS_NOTES_ROUTES } from '../modules/progress-notes/routes/progress-notes-routes';
import { VITAL_SIGNS_ROUTES } from '../modules/vital-signs/routes/vital-signs-routes';
import { FLUID_TRACKS_ROUTES } from '../modules/fluid-tracks/routes/fluid-tracks-routes';
import { CLINICAL_TASKS_ROUTES } from '../modules/clinical-tasks/routes/clinical-tasks-routes';
import {
  GENDERS_ROUTES,
  MARITAL_STATUSES_ROUTES,
  ADMISSION_TYPES_ROUTES,
  CARE_CONTINUUM_LEVELS_ROUTES,
  RACES_ROUTES,
  MEDICAL_ALLERGIES_ROUTES,
  MEDICAL_PRECAUTIONS_ROUTES,
  CONTACT_LABELS_ROUTES,
} from '../modules/settings/routes/settings-routes';

export function initializeClinical() {
  initializeMenu();
}

function initializeMenu() {
  const mainMenuManager = inject(MainMenuManager);
  const mainRoutingManager = inject(MainRoutingManager);

  mainMenuManager.addItems([
    {
      item: {
        icon: PrimeIcons.HEART,
        routerLink: ['/clinical/patients'],
        label: 'menu.clinical',
        scope: 'clinical',
        resource: 'clinical/menu',
        showInMainMenu: true,
      },
    },
    {
      item: {
        icon: PrimeIcons.COG,
        label: 'menu.clinicalSettings',
        scope: 'clinical',
        resource: 'clinical/settings/menu',
        items: [
          {
            icon: PrimeIcons.USER,
            routerLink: ['/settings/clinical/genders'],
            label: 'menu.genders',
            scope: 'clinical',
            resource: 'genders/menu',
          },
          {
            icon: PrimeIcons.TAG,
            routerLink: ['/settings/clinical/marital-statuses'],
            label: 'menu.maritalStatuses',
            scope: 'clinical',
            resource: 'marital-statuses/menu',
          },
          {
            icon: PrimeIcons.TAG,
            routerLink: ['/settings/clinical/admission-types'],
            label: 'menu.admissionTypes',
            scope: 'clinical',
            resource: 'admission-types/menu',
          },
          {
            icon: PrimeIcons.TAG,
            routerLink: ['/settings/clinical/care-continuum-levels'],
            label: 'menu.careContinuumLevels',
            scope: 'clinical',
            resource: 'care-continuum-levels/menu',
          },
          {
            icon: PrimeIcons.TAG,
            routerLink: ['/settings/clinical/races'],
            label: 'menu.races',
            scope: 'clinical',
            resource: 'races/menu',
          },
          {
            icon: PrimeIcons.TAG,
            routerLink: ['/settings/clinical/medical-allergies'],
            label: 'menu.medicalAllergies',
            scope: 'clinical',
            resource: 'medical-allergies/menu',
          },
          {
            icon: PrimeIcons.TAG,
            routerLink: ['/settings/clinical/medical-precautions'],
            label: 'menu.medicalPrecautions',
            scope: 'clinical',
            resource: 'medical-precautions/menu',
          },
          {
            icon: PrimeIcons.TAG,
            routerLink: ['/settings/clinical/contact-labels'],
            label: 'menu.contactLabels',
            scope: 'clinical',
            resource: 'contact-labels/menu',
          },
        ],
      },
      childOf: 'settings',
    },
  ]);

  mainRoutingManager.addRouting({
    newRouting: CLINICAL_ROUTES,
    basePath: 'clinical',
  });

  mainRoutingManager.addRouting({
    newRouting: CARE_CONTINUUM_ROUTES,
    basePath: 'clinical/care-continuum',
  });

  mainRoutingManager.addRouting({
    newRouting: CARE_PLAN_ROUTES,
    basePath: 'clinical/care-plan',
  });

  mainRoutingManager.addRouting({
    newRouting: CLINICAL_ORDERS_ROUTES,
    basePath: 'clinical/clinical-orders',
  });

  mainRoutingManager.addRouting({
    newRouting: PROGRESS_NOTES_ROUTES,
    basePath: 'clinical/progress-notes',
  });

  mainRoutingManager.addRouting({
    newRouting: VITAL_SIGNS_ROUTES,
    basePath: 'clinical/vital-signs',
  });

  mainRoutingManager.addRouting({
    newRouting: FLUID_TRACKS_ROUTES,
    basePath: 'clinical/fluid-tracks',
  });

  mainRoutingManager.addRouting({
    newRouting: CLINICAL_TASKS_ROUTES,
    basePath: 'clinical/clinical-tasks',
  });

  // Settings routes
  mainRoutingManager.addRouting({
    newRouting: {
      path: 'clinical',
      children: [
        { path: 'genders', children: GENDERS_ROUTES },
        { path: 'marital-statuses', children: MARITAL_STATUSES_ROUTES },
        { path: 'admission-types', children: ADMISSION_TYPES_ROUTES },
        { path: 'care-continuum-levels', children: CARE_CONTINUUM_LEVELS_ROUTES },
        { path: 'races', children: RACES_ROUTES },
        { path: 'medical-allergies', children: MEDICAL_ALLERGIES_ROUTES },
        { path: 'medical-precautions', children: MEDICAL_PRECAUTIONS_ROUTES },
        { path: 'contact-labels', children: CONTACT_LABELS_ROUTES },
      ],
    },
    childOf: 'settings',
  });
}
