import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { BaseForm, ControlsOf } from '@avalantec/base-app/form';

export interface UpdateDecomissioningFormModel {
  details: string;
}

@Injectable({ providedIn: 'root' })
export class UpdateDecomissioningForm extends BaseForm<UpdateDecomissioningFormModel> {
  constructor() {
    super();
  }

  override createForm(): FormGroup<ControlsOf<UpdateDecomissioningFormModel>> {
    return this.fb.group<UpdateDecomissioningFormModel>({
      details: ['', [Validators.required]],
    });
  }
}
