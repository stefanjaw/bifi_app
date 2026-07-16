import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';

/** Form model for admission type create/edit forms */
export interface AdmissionTypeFormModel {
  _id: string;
  name: string;
  description: string;
  active: boolean;
}

/** Form service for admission type create/edit forms */
@Injectable({ providedIn: 'root' })
export class AdmissionTypeForm extends BaseForm<AdmissionTypeFormModel> {
  /** @inheritdoc */
  override createForm() {
    return this.fb.group<AdmissionTypeFormModel>({
      _id: [''],
      name: [''],
      description: [''],
      active: [true],
    });
  }
}
