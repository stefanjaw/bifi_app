import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface ContactFormModel {
  name: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  parentId?: string;
  type: 'individual' | 'company';
}

@Injectable({
  providedIn: 'root',
})
export class ContactForm extends BaseForm<ContactFormModel> {
  override createForm() {
    return this.fb.group<ContactFormModel>({
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      parentId: [''],
      type: ['individual', [Validators.required]],
    });
  }
}
