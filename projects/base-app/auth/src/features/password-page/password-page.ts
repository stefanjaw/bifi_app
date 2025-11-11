import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { injectAuthService } from '../../libraries/providers/auth-service-provider';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { ReactiveFormsModule } from '@angular/forms';
import { ResetPasswordForm, resetPasswordFormModel } from '../../services/reset-password-form';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'bifi-app-password-page',
  imports: [FormModule, ReactiveFormsModule, ButtonModule, InputText],
  templateUrl: './password-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordPage {
  private auth = injectAuthService();
  private formService = inject(ResetPasswordForm);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);

  form = this.formService.form;
  isSubmitLoading = signal<boolean>(false);

  async sendEmail(data: FormValueState<resetPasswordFormModel>) {
    this.auth.sendResetPasswordEmail(data.value.email || '');
  }

  goBack() {
    this.router.navigate(['/auth/signin']);
  }
}
