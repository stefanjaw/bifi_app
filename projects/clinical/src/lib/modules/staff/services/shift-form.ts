import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';

/** Form model for shift create/edit */
export interface ShiftFormModel {
  _id: string;
  name: string;
  manager: string;
  timeStart: string;
  timeEnd: string;
  dateStart: string;
  dateEnd: string;
  type: string;
  staffId: string;
  patientId: string;
  active: boolean;
}

/** Form service for shift create/edit */
@Injectable({ providedIn: 'root' })
export class ShiftForm extends BaseForm<ShiftFormModel> {
  override createForm() {
    return this.fb.group<ShiftFormModel>({
      _id: [''],
      name: [''],
      manager: [''],
      timeStart: [''],
      timeEnd: [''],
      dateStart: [''],
      dateEnd: [''],
      type: ['Morning'],
      staffId: [''],
      patientId: [''],
      active: [true],
    });
  }
}
