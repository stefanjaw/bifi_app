import { Component, input, output, inject, effect, computed } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { AppFormExtensionsImports } from '@avalantec/base-app/form';
import { AuthFormService } from '../../services/auth-form';
import type { authFormData, socialProvider } from '../../interfaces/auth.model';

@Component({
  selector: 'bifi-app-auth-form',
  imports: [
    CommonModule,
    ButtonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    DividerModule,
    AppFormExtensionsImports,
  ],
  providers: [AuthFormService],
  templateUrl: './auth-form.html',
})
export class AuthForm {
  private authFormService = inject(AuthFormService);

  // Inputs
  formData = input.required<authFormData>();
  socialProviders = input<socialProvider[]>([]);

  // Outputs
  handleSubmit = output<any>();
  handleSocialLogin = output<string>();
  handleToggleMode = output<void>();

  // Expose form for template
  form = this.authFormService.form;

  isLogin = computed(() => this.formData().isLogin);
  isLoading = computed(() => this.formData().isLoading);
  error = computed(() => this.formData().error);

  constructor() {
    // Update form when mode changes
    effect(() => {
      const data = this.formData();
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
