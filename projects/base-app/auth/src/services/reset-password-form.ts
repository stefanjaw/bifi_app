import { BaseForm } from '@avalantec/base-app/form';
import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';

export interface resetPasswordFormModel {
  email: string;
}

@Injectable({ providedIn: 'root' })
export class ResetPasswordForm extends BaseForm<resetPasswordFormModel> {
  override createForm() {
    return this.fb.group<resetPasswordFormModel>({
      email: ['', [Validators.required, Validators.email]],
    });
  }
}
