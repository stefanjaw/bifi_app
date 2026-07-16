import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';

/** Form model for intervention create/edit */
export interface InterventionFormModel {
  _id: string;
  admissionGoalId: string;
  state: string;
  patientId: string;
  archived: boolean;
  contentTitle: string;
  contentBody: string;
  outcomes: string[];
  orderSetIds: string[];
  orderIds: string[];
  createdBy: string;
  updatedBy: string;
  active: boolean;
}

/** Form service for intervention create/edit */
@Injectable({ providedIn: 'root' })
export class InterventionForm extends BaseForm<InterventionFormModel> {
  /** @inheritdoc */
  override createForm() {
    return this.fb.group<InterventionFormModel>({
      _id: [''],
      admissionGoalId: [''],
      state: [''],
      patientId: [''],
      archived: [false],
      contentTitle: [''],
      contentBody: [''],
      outcomes: { template: [''], formArrayElements: [] },
      orderSetIds: { template: [''], formArrayElements: [] },
      orderIds: { template: [''], formArrayElements: [] },
      createdBy: [''],
      updatedBy: [''],
      active: [true],
    });
  }
}
