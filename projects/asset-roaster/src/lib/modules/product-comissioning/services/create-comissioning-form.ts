import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm, FormUploaderFile } from '@avalantec/base-app/form';

export interface CreateComissioningFormModel {
  outcome: 'fail' | 'pass';
  details: string;
  attachments?: FormUploaderFile[];
}

@Injectable({ providedIn: 'root' })
export class CreateComissioningForm extends BaseForm<CreateComissioningFormModel> {
  constructor() {
    super();
  }

  override createForm() {
    return this.fb.group<CreateComissioningFormModel>({
      outcome: ['fail', [Validators.required]],
      details: ['', [Validators.required]],
      attachments: {
        template: {
          id: [''],
          file: [],
        },
        formArrayElements: [],
      },
    });
  }
}
