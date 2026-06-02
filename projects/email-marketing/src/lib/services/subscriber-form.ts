import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface SubscriberFormModel {
  email: string;
  name: string;
  listId: string;
  status: string;
  tagsInput: string;
}

@Injectable({
  providedIn: 'root',
})
export class SubscriberForm extends BaseForm<SubscriberFormModel> {
  override createForm() {
    return this.fb.group<SubscriberFormModel>({
      email: ['', [Validators.required, Validators.email]],
      name: [''],
      listId: ['', [Validators.required]],
      status: ['subscribed'],
      tagsInput: [''],
    });
  }
}
