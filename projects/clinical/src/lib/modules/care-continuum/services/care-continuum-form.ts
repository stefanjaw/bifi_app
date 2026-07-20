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

  get medications() {
    return this.form.controls.medications;
  }
  get allergies() {
    return this.form.controls.allergies;
  }
  get immunizations() {
    return this.form.controls.immunizations;
  }
  get precautions() {
    return this.form.controls.precautions;
  }
  get socialHistory() {
    return this.form.controls.socialHistory;
  }
  get familyHistory() {
    return this.form.controls.familyHistory;
  }
  get medicalHistory() {
    return this.form.controls.medicalHistory;
  }
  get surgicalHistory() {
    return this.form.controls.surgicalHistory;
  }
  get advanceDirectives() {
    return this.form.controls.advanceDirectives;
  }
  get externalProviders() {
    return this.form.controls.externalProviders;
  }

  /** Adds a medication item to the form array */
  addMedication() {
    this.form.controls.medications.push(
      this.fb.group<medicationItem>({
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
      })
    );
  }
  /** Removes a medication item from the form array at the given index */
  removeMedication(index: number) {
    this.form.controls.medications.removeAt(index);
  }

  /** Adds an allergy item to the form array */
  addAllergy() {
    this.form.controls.allergies.push(
      this.fb.group<allergyItem>({
        medicalAllergyId: [''],
        note: [''],
        severity: [''],
        active: [true],
      })
    );
  }
  /** Removes an allergy item from the form array at the given index */
  removeAllergy(index: number) {
    this.form.controls.allergies.removeAt(index);
  }

  /** Adds an immunization item to the form array */
  addImmunization() {
    this.form.controls.immunizations.push(
      this.fb.group<immunizationItem>({
        productId: [''],
        dateGiven: [''],
        lotCode: [''],
        contactId: [''],
        totalDoses: [0],
        dosesGiven: [0],
        note: [''],
        active: [true],
      })
    );
  }
  /** Removes an immunization item from the form array at the given index */
  removeImmunization(index: number) {
    this.form.controls.immunizations.removeAt(index);
  }

  /** Adds a precaution item to the form array */
  addPrecaution() {
    this.form.controls.precautions.push(
      this.fb.group<precautionItem>({ medicalPrecautionId: [''], note: [''], active: [true] })
    );
  }
  /** Removes a precaution item from the form array at the given index */
  removePrecaution(index: number) {
    this.form.controls.precautions.removeAt(index);
  }

  /** Adds a social history item to the form array */
  addSocialHistory() {
    this.form.controls.socialHistory.push(this.fb.group<historyItem>({ description: [''] }));
  }
  /** Removes a social history item from the form array at the given index */
  removeSocialHistory(index: number) {
    this.form.controls.socialHistory.removeAt(index);
  }

  /** Adds a family history item to the form array */
  addFamilyHistory() {
    this.form.controls.familyHistory.push(this.fb.group<historyItem>({ description: [''] }));
  }
  /** Removes a family history item from the form array at the given index */
  removeFamilyHistory(index: number) {
    this.form.controls.familyHistory.removeAt(index);
  }

  /** Adds a medical history item to the form array */
  addMedicalHistory() {
    this.form.controls.medicalHistory.push(this.fb.group<historyItem>({ description: [''] }));
  }
  /** Removes a medical history item from the form array at the given index */
  removeMedicalHistory(index: number) {
    this.form.controls.medicalHistory.removeAt(index);
  }

  /** Adds a surgical history item to the form array */
  addSurgicalHistory() {
    this.form.controls.surgicalHistory.push(this.fb.group<historyItem>({ description: [''] }));
  }
  /** Removes a surgical history item from the form array at the given index */
  removeSurgicalHistory(index: number) {
    this.form.controls.surgicalHistory.removeAt(index);
  }

  /** Adds an advance directive item to the form array */
  addAdvanceDirective() {
    this.form.controls.advanceDirectives.push(
      this.fb.group<advanceDirectiveItem>({ types: [''], outdated: [false], information: [''] })
    );
  }
  /** Removes an advance directive item from the form array at the given index */
  removeAdvanceDirective(index: number) {
    this.form.controls.advanceDirectives.removeAt(index);
  }

  /** Adds an external provider item to the form array */
  addExternalProvider() {
    this.form.controls.externalProviders.push(
      this.fb.group<externalProviderItem>({ contactId: [''], providerType: [''] })
    );
  }
  /** Removes an external provider item from the form array at the given index */
  removeExternalProvider(index: number) {
    this.form.controls.externalProviders.removeAt(index);
  }
}
