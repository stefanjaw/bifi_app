import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';

/** Advance directive item within care continuum */
export interface advanceDirectiveItem {
  types: string;
  outdated: boolean;
  information: string;
}

/** History record item (social, family, medical, surgical) */
export interface historyItem {
  description: string;
}

/** Medication record item */
export interface medicationItem {
  productId: string;
  uomId: string;
  strength: string;
  routeId: string;
  frequencyId: string;
  duration: number;
  durationUnit: string;
  startDate: string;
  quantity: number;
  note: string;
  active: boolean;
}

/** Allergy record item */
export interface allergyItem {
  medicalAllergyId: string;
  note: string;
  severity: string;
  active: boolean;
}

/** Immunization record item */
export interface immunizationItem {
  productId: string;
  dateGiven: string;
  lotCode: string;
  contactId: string;
  totalDoses: number;
  dosesGiven: number;
  note: string;
  active: boolean;
}

/** Precaution record item */
export interface precautionItem {
  medicalPrecautionId: string;
  note: string;
  active: boolean;
}

/** Health care proxy contact information */
export interface healthCareProxy {
  contactId: string;
  relationShip: string;
}

/** External provider reference item */
export interface externalProviderItem {
  contactId: string;
  providerType: string;
}

/** Form model for care continuum create/edit */
export interface CareContinuumFormModel {
  _id: string;
  patientId: string;
  typeOfEvent: string;
  careContinuumLevelId: string;
  state: string;
  transferPoint: string;
  assignedCaregiver: string;
  assignedNurse: string;
  unitId: string;
  bedId: string;
  roomId: string;
  insuranceCarrier: string;
  planNumber: string;
  groupNumber: string;
  policyNumber: string;
  memberId: string;
  effectiveDate: string;
  endDate: string;
  genderAtBirth: string;
  genderAtPresent: string;
  race: string;
  height: number;
  weight: number;
  advanceDirectives: advanceDirectiveItem[];
  socialHistory: historyItem[];
  familyHistory: historyItem[];
  medicalHistory: historyItem[];
  surgicalHistory: historyItem[];
  medications: medicationItem[];
  allergies: allergyItem[];
  immunizations: immunizationItem[];
  precautions: precautionItem[];
  healthCareProxyContactId: string;
  healthCareProxyRelationShip: string;
  externalProviders: externalProviderItem[];
  extraFields: unknown;
  createdBy: string;
  updatedBy: string;
  active: boolean;
}

/** Form service for care continuum create/edit */
@Injectable({ providedIn: 'root' })
export class CareContinuumForm extends BaseForm<CareContinuumFormModel> {
  /** @inheritdoc */
  override createForm() {
    return this.fb.group<CareContinuumFormModel>({
      _id: [''],
      patientId: [''],
      typeOfEvent: ['Admission'],
      careContinuumLevelId: [''],
      state: ['Draft'],
      transferPoint: [''],
      assignedCaregiver: [''],
      assignedNurse: [''],
      unitId: [''],
      bedId: [''],
      roomId: [''],
      insuranceCarrier: [''],
      planNumber: [''],
      groupNumber: [''],
      policyNumber: [''],
      memberId: [''],
      effectiveDate: [''],
      endDate: [''],
      genderAtBirth: [''],
      genderAtPresent: [''],
      race: [''],
      height: [0],
      weight: [0],
      advanceDirectives: {
        template: {
          types: [''],
          outdated: [false],
          information: [''],
        },
        formArrayElements: [],
      },
      socialHistory: {
        template: {
          description: [''],
        },
        formArrayElements: [],
      },
      familyHistory: {
        template: {
          description: [''],
        },
        formArrayElements: [],
      },
      medicalHistory: {
        template: {
          description: [''],
        },
        formArrayElements: [],
      },
      surgicalHistory: {
        template: {
          description: [''],
        },
        formArrayElements: [],
      },
      medications: {
        template: {
          productId: [''],
          uomId: [''],
          strength: [''],
          routeId: [''],
          frequencyId: [''],
          duration: [0],
          durationUnit: [''],
          startDate: [''],
          quantity: [0],
          note: [''],
          active: [true],
        },
        formArrayElements: [],
      },
      allergies: {
        template: {
          medicalAllergyId: [''],
          note: [''],
          severity: [''],
          active: [true],
        },
        formArrayElements: [],
      },
      immunizations: {
        template: {
          productId: [''],
          dateGiven: [''],
          lotCode: [''],
          contactId: [''],
          totalDoses: [0],
          dosesGiven: [0],
          note: [''],
          active: [true],
        },
        formArrayElements: [],
      },
      precautions: {
        template: {
          medicalPrecautionId: [''],
          note: [''],
          active: [true],
        },
        formArrayElements: [],
      },
      healthCareProxyContactId: [''],
      healthCareProxyRelationShip: [''],
      externalProviders: {
        template: {
          contactId: [''],
          providerType: [''],
        },
        formArrayElements: [],
      },
      extraFields: [null],
      createdBy: [''],
      updatedBy: [''],
      active: [true],
    });
  }
}
