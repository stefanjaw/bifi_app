import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface EmailTemplateFormModel {
  name: string;
  description: string;
  category: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmailTemplateForm extends BaseForm<EmailTemplateFormModel> {
  override createForm() {
    return this.fb.group<EmailTemplateFormModel>({
      name: ['', [Validators.required]],
      description: [''],
      category: [''],
    });
  }
}
