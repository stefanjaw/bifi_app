import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';

/** Form model for medical allergy create/edit forms */
export interface MedicalAllergyFormModel {
  _id: string;
  name: string;
  acronym: string;
  description: string;
  active: boolean;
}

/** Form service for medical allergy create/edit forms */
@Injectable({ providedIn: 'root' })
export class MedicalAllergyForm extends BaseForm<MedicalAllergyFormModel> {
  /** @inheritdoc */
  override createForm() {
    return this.fb.group<MedicalAllergyFormModel>({
      _id: [''],
      name: [''],
      acronym: [''],
      description: [''],
      active: [true],
    });
  }
}
