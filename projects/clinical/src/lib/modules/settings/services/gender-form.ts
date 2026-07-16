import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';

/** Form model for gender create/edit forms */
export interface GenderFormModel {
  _id: string;
  name: string;
  description: string;
  active: boolean;
}

/** Form service for gender create/edit forms */
@Injectable({ providedIn: 'root' })
export class GenderForm extends BaseForm<GenderFormModel> {
  /** @inheritdoc */
  override createForm() {
    return this.fb.group<GenderFormModel>({
      _id: [''],
      name: [''],
      description: [''],
      active: [true],
    });
  }
}
