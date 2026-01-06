import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm, FormUploaderFile } from '@avalantec/base-app/form';

export interface ShippingFileFormModel {
  files: FormUploaderFile[];
}

@Injectable({
  providedIn: 'root',
})
export class ShippingFileForm extends BaseForm<ShippingFileFormModel> {
  override createForm() {
    return this.fb.group<ShippingFileFormModel>({
      files: {
        template: {
          id: [''],
          file: [null!],
        },
        formArrayElements: [],
        validators: [Validators.required],
      },
    });
  }
}
