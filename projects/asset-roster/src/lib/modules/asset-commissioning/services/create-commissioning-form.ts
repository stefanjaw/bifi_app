import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm, FormUploaderFile, NonWhitespaceValidators } from '@avalantec/base-app/form';

export interface CreateCommissioningFormModel {
  outcome: 'fail' | 'pass';
  details: string;
  attachments?: FormUploaderFile[];
}

@Injectable({ providedIn: 'root' })
export class CreateCommissioningForm extends BaseForm<CreateCommissioningFormModel> {
  constructor() {
    super();
  }

  override createForm() {
    return this.fb.group<CreateCommissioningFormModel>({
      outcome: ['fail', [Validators.required]],
      details: ['', [NonWhitespaceValidators.nonWhitespaceRequired]],
      attachments: {
        template: {
          id: [''],
          file: [null!],
        },
        formArrayElements: [],
      },
    });
  }
}
