import { Injectable } from '@angular/core';
import { BaseForm, FormUploaderFile } from '@avalantec/base-app/form';

export interface addDocumentFormModel {
  descriptor: string;
  files: FormUploaderFile[];
}

@Injectable({
  providedIn: 'root',
})
export class AddDocumentForm extends BaseForm<addDocumentFormModel> {
  override createForm() {
    return this.fb.group<addDocumentFormModel>({
      descriptor: [''],
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
