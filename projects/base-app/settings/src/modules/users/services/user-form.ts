import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { ArrayValidators, BaseForm } from '@avalantec/base-app/form';

export interface UserFormModel {
  username?: string;
  email?: string;
  picture?: string;
  roles: string[];
  contactId: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserForm extends BaseForm<UserFormModel> {
  override createForm() {
    return this.fb.group<UserFormModel>({
      username: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }],
      picture: [{ value: '', disabled: true }],
      roles: {
        template: [''],
        validators: [ArrayValidators.minLength(1)],
        formArrayElements: [],
      },
      contactId: ['', Validators.required],
    });
  }
}
