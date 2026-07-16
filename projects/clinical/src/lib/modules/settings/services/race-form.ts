import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';

/** Form model for race create/edit forms */
export interface RaceFormModel {
  _id: string;
  name: string;
  description: string;
  active: boolean;
}

/** Form service for race create/edit forms */
@Injectable({ providedIn: 'root' })
export class RaceForm extends BaseForm<RaceFormModel> {
  /** @inheritdoc */
  override createForm() {
    return this.fb.group<RaceFormModel>({
      _id: [''],
      name: [''],
      description: [''],
      active: [true],
    });
  }
}
