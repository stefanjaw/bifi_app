import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { BaseForm, ControlsOf } from '@avalantec/base-app/form';

export interface DecomissioningFormModel {
  details: string;
}

@Injectable({ providedIn: 'root' })
export class DecomissioningForm extends BaseForm<DecomissioningFormModel> {
  constructor() {
    super();
  }

  override createForm(): FormGroup<ControlsOf<DecomissioningFormModel>> {
    return this.fb.group<DecomissioningFormModel>({
      details: ['', [Validators.required]],
    });
  }
}
