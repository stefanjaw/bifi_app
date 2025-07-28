import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { BaseForm, ControlsOf } from '@avalantec/base-app/form';

export interface CreateComissioningFormModel {
  outcome: 'fail' | 'pass';
  details: string;
  attachments?: any | null;
}

@Injectable({ providedIn: 'root' })
export class CreateComissioningForm extends BaseForm<CreateComissioningFormModel> {
  constructor() {
    super();
  }

  override createForm(): FormGroup<ControlsOf<CreateComissioningFormModel>> {
    return this.fb.group<CreateComissioningFormModel>({
      outcome: ['fail', [Validators.required]],
      details: ['', [Validators.required]],
      attachments: [null],
    });
  }
}
