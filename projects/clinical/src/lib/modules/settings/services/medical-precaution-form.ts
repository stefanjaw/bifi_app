import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';

/** Form model for medical precaution create/edit forms */
export interface MedicalPrecautionFormModel {
  _id: string;
  name: string;
  description: string;
  active: boolean;
}

/** Form service for medical precaution create/edit forms */
@Injectable({ providedIn: 'root' })
export class MedicalPrecautionForm extends BaseForm<MedicalPrecautionFormModel> {
  /** @inheritdoc */
  override createForm() {
    return this.fb.group<MedicalPrecautionFormModel>({
      _id: [''],
      name: [''],
      description: [''],
      active: [true],
    });
  }
}
