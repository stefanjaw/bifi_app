import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';

/** Form model for contact label create/edit forms */
export interface ContactLabelFormModel {
  _id: string;
  name: string;
  value: string;
  description: string;
  active: boolean;
}

/** Form service for contact label create/edit forms */
@Injectable({ providedIn: 'root' })
export class ContactLabelForm extends BaseForm<ContactLabelFormModel> {
  /** @inheritdoc */
  override createForm() {
    return this.fb.group<ContactLabelFormModel>({
      _id: [''],
      name: [''],
      value: [''],
      description: [''],
      active: [true],
    });
  }
}
