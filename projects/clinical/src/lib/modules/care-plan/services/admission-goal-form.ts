import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';

/** Form model for admission goal create/edit */
export interface AdmissionGoalFormModel {
  _id: string;
  careContinuumId: string;
  state: string;
  tracking: string;
  patientId: string;
  interventions: string[];
  archived: boolean;
  contentTitle: string;
  contentBody: string;
  priority: number;
  createdBy: string;
  updatedBy: string;
  active: boolean;
}

/** Form service for admission goal create/edit */
@Injectable({ providedIn: 'root' })
export class AdmissionGoalForm extends BaseForm<AdmissionGoalFormModel> {
  /** @inheritdoc */
  override createForm() {
    return this.fb.group<AdmissionGoalFormModel>({
      _id: [''],
      careContinuumId: [''],
      state: [''],
      tracking: [''],
      patientId: [''],
      interventions: { template: [''], formArrayElements: [] },
      archived: [false],
      contentTitle: [''],
      contentBody: [''],
      priority: [0],
      createdBy: [''],
      updatedBy: [''],
      active: [true],
    });
  }
}
