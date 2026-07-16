import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';

/** Form model for outcome create/edit */
export interface OutcomeFormModel {
  _id: string;
  interventionId: string;
  patientId: string;
  archived: boolean;
  contentTitle: string;
  contentBody: string;
  createdBy: string;
  updatedBy: string;
  active: boolean;
}

/** Form service for outcome create/edit */
@Injectable({ providedIn: 'root' })
export class OutcomeForm extends BaseForm<OutcomeFormModel> {
  /** @inheritdoc */
  override createForm() {
    return this.fb.group<OutcomeFormModel>({
      _id: [''],
      interventionId: [''],
      patientId: [''],
      archived: [false],
      contentTitle: [''],
      contentBody: [''],
      createdBy: [''],
      updatedBy: [''],
      active: [true],
    });
  }
}
