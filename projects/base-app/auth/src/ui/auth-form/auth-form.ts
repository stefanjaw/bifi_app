import { Component, input, output, inject, effect, computed } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { AuthFormService } from '../../services/auth-form';
import { authSocialProvider } from '../../interfaces/auth-social-provider';
import { authFormState } from '../../interfaces/auth-form-state';
import {
  FormActionsHandler,
  FormError,
  FormField,
  FormLabel,
  FormLayout,
  FormSection,
} from '@avalantec/base-app/form';

@Component({
  selector: 'bifi-app-auth-form',
  imports: [
    ButtonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    DividerModule,
    FormActionsHandler,
    FormSection,
    FormLayout,
    FormField,
    FormLabel,
    FormError,
  ],
  providers: [AuthFormService],
  templateUrl: './auth-form.html',
})
export class AuthForm {
  private authFormService = inject(AuthFormService);

  // Inputs
  formState = input.required<authFormState>();
  socialProviders = input<authSocialProvider[]>([]);

  // Outputs
  handleSubmit = output<any>();
  handleSocialLogin = output<string>();
  handleToggleMode = output<void>();

  // Expose form for template
  form = this.authFormService.form;

  isLogin = computed(() => this.formState().isLogin);
  isLoading = computed(() => this.formState().isLoading);

  constructor() {
    // Update form when mode changes
    effect(() => {
      const data = this.formState();
      this.authFormService.setLoginMode(data.isLogin);
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const formState = this.authFormService.getValueState();
      this.handleSubmit.emit(formState.rawValue);
    }
  }

  onSocialLogin(provider: string) {
    this.handleSocialLogin.emit(provider);
  }

  onToggleMode() {
    this.handleToggleMode.emit();
  }
}
