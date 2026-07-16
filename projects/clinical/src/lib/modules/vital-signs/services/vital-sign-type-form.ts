import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';

/** A reference range item for a vital sign type */
export interface rangeItem {
  name: string;
  color: string;
  min: number;
  max: number;
}

/** Form model for vital sign type create/edit */
export interface VitalSignTypeFormModel {
  _id: string;
  name: string;
  value: string;
  unit: string;
  ranges: rangeItem[];
  active: boolean;
}

/** Form service for vital sign type create/edit */
@Injectable({ providedIn: 'root' })
export class VitalSignTypeForm extends BaseForm<VitalSignTypeFormModel> {
  override createForm() {
    return this.fb.group<VitalSignTypeFormModel>({
      _id: [''],
      name: [''],
      value: [''],
      unit: [''],
      ranges: {
        template: {
          name: [''],
          color: [''],
          min: [0],
          max: [0],
        },
        formArrayElements: [],
      },
      active: [true],
    });
  }
}
