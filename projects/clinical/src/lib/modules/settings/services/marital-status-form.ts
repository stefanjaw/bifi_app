import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';

/** Form model for marital status create/edit forms */
export interface MaritalStatusFormModel {
  _id: string;
  name: string;
  value: string;
  description: string;
  active: boolean;
}

/** Form service for marital status create/edit forms */
@Injectable({ providedIn: 'root' })
export class MaritalStatusForm extends BaseForm<MaritalStatusFormModel> {
  /** @inheritdoc */
  override createForm() {
    return this.fb.group<MaritalStatusFormModel>({
      _id: [''],
      name: [''],
      value: [''],
      description: [''],
      active: [true],
    });
  }
}
