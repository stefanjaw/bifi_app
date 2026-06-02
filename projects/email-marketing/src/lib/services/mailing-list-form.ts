import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface MailingListFormModel {
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class MailingListForm extends BaseForm<MailingListFormModel> {
  override createForm() {
    return this.fb.group<MailingListFormModel>({
      name: ['', [Validators.required]],
      description: [''],
    });
  }
}
