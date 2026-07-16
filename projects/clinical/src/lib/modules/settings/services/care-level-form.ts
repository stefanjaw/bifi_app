import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';

/** Form model for care continuum level create/edit forms */
export interface CareContinuumLevelFormModel {
  _id: string;
  name: string;
  value: string;
  description: string;
  active: boolean;
}

/** Form service for care continuum level create/edit forms */
@Injectable({ providedIn: 'root' })
export class CareContinuumLevelForm extends BaseForm<CareContinuumLevelFormModel> {
  /** @inheritdoc */
  override createForm() {
    return this.fb.group<CareContinuumLevelFormModel>({
      _id: [''],
      name: [''],
      value: [''],
      description: [''],
      active: [true],
    });
  }
}
