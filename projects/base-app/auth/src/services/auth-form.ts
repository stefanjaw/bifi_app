import { effect, Injectable, signal } from '@angular/core';
import { Validators, type AbstractControl, type ValidationErrors } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

export interface authFormModel {
  emailOrUsername: string;
  password: string;
  confirmPassword?: string;
}

@Injectable()
export class AuthFormService extends BaseForm<authFormModel> {
  private isLoginMode = signal(true);

  constructor() {
    super();
    effect(() => {
      const form = this.form;
      const isLogin = this.isLoginMode();

      if (isLogin) {
        form.controls.confirmPassword.disable();
        form.removeValidators(this.passwordMatchValidator);
      } else {
        form.controls.confirmPassword.enable();
        form.addValidators(this.passwordMatchValidator);
      }
    });
  }

  setLoginMode(isLogin: boolean) {
    this.isLoginMode.set(isLogin);
  }

  override createForm() {
    return this.fb.group<authFormModel>({
      emailOrUsername: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  private passwordMatchValidator = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) return null;

    const passwordValue = password.value;
    const confirmPasswordValue = confirmPassword.value;

    // If the passwords do not match, set an error on both controls
    if (passwordValue !== confirmPasswordValue && password.dirty && confirmPassword.dirty) {
      password.setErrors({ passwordMatch: true, ...password.errors });
      confirmPassword.setErrors({ passwordMatch: true, ...confirmPassword.errors });

      return { passwordMatch: true };
    }

    // Remove the error if passwords match
    if (confirmPassword.hasError('passwordMatch')) {
      const { passwordMatch, ...errors } = confirmPassword.errors || {};
      confirmPassword.setErrors(Object.keys(errors).length ? errors : null);
      confirmPassword.updateValueAndValidity();
    }

    // Remove the error if passwords match
    if (password.hasError('passwordMatch')) {
      const { passwordMatch, ...errors } = password.errors || {};
      password.setErrors(Object.keys(errors).length ? errors : null);
      password.updateValueAndValidity();
    }

    return null;
  };
}
