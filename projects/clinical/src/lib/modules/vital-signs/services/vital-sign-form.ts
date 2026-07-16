import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';

/** A single measured vital entry with value, method, and type reference */
export interface measuredVitalItem {
  value: string;
  method: string;
  vitalSignTypeId: string;
}

/** Form model for vital sign create/edit */
export interface VitalSignFormModel {
  _id: string;
  dateVital: string;
  measuredVitals: measuredVitalItem[];
  patientId: string;
  createdBy: string;
  updatedBy: string;
  active: boolean;
}

/** Form service for vital sign create/edit */
@Injectable({ providedIn: 'root' })
export class VitalSignForm extends BaseForm<VitalSignFormModel> {
  override createForm() {
    return this.fb.group<VitalSignFormModel>({
      _id: [''],
      dateVital: [''],
      measuredVitals: {
        template: {
          value: [''],
          method: [''],
          vitalSignTypeId: [''],
        },
        formArrayElements: [],
      },
      patientId: [''],
      createdBy: [''],
      updatedBy: [''],
      active: [true],
    });
  }
}
