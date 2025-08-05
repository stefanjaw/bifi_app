import { effect, Injectable, signal } from '@angular/core';
import { Validators, type AbstractControl, type ValidationErrors } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';
import type { authFormModel, registerFormModel } from '../interfaces/auth.model';

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
      } else {
        form.controls.confirmPassword.enable();
      }
    });
  }

  setLoginMode(isLogin: boolean) {
    this.isLoginMode.set(isLogin);
  }

  override createForm() {
    return this.fb.group<registerFormModel>(
      {
        emailOrUsername: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  private passwordMatchValidator = (control: AbstractControl): ValidationErrors | null => {
    if (this.isLoginMode()) return null;

    const password = control.get('password')?.value;

    const confirmPasswordControl = control.get('confirmPassword');
    if (!confirmPasswordControl || !confirmPasswordControl.enabled) return null;

    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  };
}
