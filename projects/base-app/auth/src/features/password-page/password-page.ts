import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { injectAuthService } from '../../libraries/providers/auth-service-provider';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { ReactiveFormsModule } from '@angular/forms';
import { ResetPasswordForm, resetPasswordFormModel } from '../../services/reset-password-form';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { ToastManager } from '@avalantec/base-app/core';

@Component({
  selector: 'bifi-app-password-page',
  imports: [FormModule, ReactiveFormsModule, ButtonModule, InputText],
  templateUrl: './password-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordPage implements OnInit {
  private auth = injectAuthService();
  private formService = inject(ResetPasswordForm);
  private router = inject(Router);
  private toastManager = inject(ToastManager);

  form = this.formService.form;
  isSubmitLoading = signal<boolean>(false);
  emailSent = signal(false);

  ngOnInit(): void {
    this.formService.reset();
  }

  async sendEmail(data: FormValueState<resetPasswordFormModel>) {
    try {
      this.isSubmitLoading.set(true);
      this.auth.sendResetPasswordEmail(data.value.email || '');
      this.toastManager.showSuccess('Password reset email sent successfully');
      this.emailSent.set(true);
      this.form.reset();
    } catch (error: any) {
      this.toastManager.showError('Error sending password reset email: ' + error.message);
    } finally {
      this.isSubmitLoading.set(false);
    }
  }

  goBack() {
    this.router.navigate(['/auth/signin']);
  }
}
