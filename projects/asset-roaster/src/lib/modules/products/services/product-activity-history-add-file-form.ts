import { Injectable } from '@angular/core';
import { BaseForm, FormUploaderFile } from '@avalantec/base-app/form';

export interface ProductActivityHistoryAddFileFormModel {
  file: FormUploaderFile[];
}

@Injectable({
  providedIn: 'root',
})
export class ProductActivityHistoryAddFileForm extends BaseForm<ProductActivityHistoryAddFileFormModel> {
  override createForm() {
    return this.fb.group<ProductActivityHistoryAddFileFormModel>({
      file: {
        template: {
          id: [''],
          file: [null!],
        },
        formArrayElements: [],
      },
    });
  }
}
