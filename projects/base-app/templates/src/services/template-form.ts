import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface TemplateFormModel {
  name: string;
  codeOriginal?: string;
  codeCustom?: string;
  directory: string;
  filename: string;
  mimeType:
    | 'text/typescript'
    | 'application/typescript'
    | 'application/javascript'
    | 'text/javascript'
    | 'text/html'
    | 'text/css';
}

@Injectable({
  providedIn: 'root',
})
export class TemplateForm extends BaseForm<TemplateFormModel> {
  override createForm() {
    return this.fb.group<TemplateFormModel>({
      name: ['', [Validators.required]],
      codeOriginal: [''],
      codeCustom: [''],
      directory: ['', [Validators.required]],
      filename: ['', [Validators.required]],
      mimeType: ['text/html', [Validators.required]],
    });
  }
}
