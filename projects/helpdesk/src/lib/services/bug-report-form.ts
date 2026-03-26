import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm, FormUploaderFile } from '@avalantec/base-app/form';

export interface BugReportFormModel {
  name: string;
  description: string;
  files: FormUploaderFile[];
}

@Injectable({
  providedIn: 'root',
})
export class BugReportForm extends BaseForm<BugReportFormModel> {
  override createForm() {
    return this.fb.group<BugReportFormModel>({
      name: ['', [Validators.required]],
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
