import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm, FormUploaderFile } from '@avalantec/base-app/form';

export interface BugReportingFormModel {
  subject: string;
  description: string;
  files: FormUploaderFile[];
}

@Injectable({
  providedIn: 'root',
})
export class BugReportingForm extends BaseForm<BugReportingFormModel> {
  override createForm() {
    return this.fb.group<BugReportingFormModel>({
      subject: ['', [Validators.required]],
      description: ['', [Validators.required]],
      files: {
        template: {
          id: [''],
          file: [null!],
        },
        formArrayElements: [],
      },
    });
  }
}
