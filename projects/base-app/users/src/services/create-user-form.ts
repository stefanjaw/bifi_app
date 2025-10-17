import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { ArrayValidators, BaseForm } from '@avalantec/base-app/form';

export interface CreateUserFormModel {
  name: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root',
})
export class CreateUserForm extends BaseForm<CreateUserFormModel> {
  override createForm() {
    return this.fb.group<CreateUserFormModel>({
      name: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      roles: {
        template: [''],
        validators: [ArrayValidators.minLength(1)],
        formArrayElements: [],
      },
    });
  }
}
