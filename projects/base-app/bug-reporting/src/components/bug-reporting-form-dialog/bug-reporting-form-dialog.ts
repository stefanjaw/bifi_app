import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { BugReportingForm, BugReportingFormModel } from '../../services/bug-reporting-form';
import { CrudBugReporting } from '../../services/crud-bug-reporting';
import { BaseDialog } from '@avalantec/base-app/core';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule } from 'primeng/fileupload';
import { injectAuthService } from '@avalantec/base-app/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'bifi-app-bug-reporting-form-dialog',
  imports: [
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    FormModule,
    FileUploadModule,
  ],
  templateUrl: './bug-reporting-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BugReportingFormDialog extends BaseDialog {
  protected formService = inject(BugReportingForm);
  private destroy$ = inject(DestroyRef);
  private bugReportingService = inject(CrudBugReporting);
  private router = inject(Router);
  private authService = injectAuthService();

  // State
  form = this.formService.form;
  isSubmitLoading = signal(false);

  /**
   * Opens the dialog and resets the form before opening it.
   *
   * This is necessary because the form is reused between multiple dialog instances.
   */
  override openDialog(): void {
    this.formService.reset();
    super.openDialog();
  }

  /**
   * Handles the submission of the form and creates a new bug report in the backend.
   *
   * @param data the form data
   */
  handleSubmit(data: FormValueState<BugReportingFormModel>) {
    this.isSubmitLoading.set(true);

    // Get the user's email
    const email = this.authService.user()?.email;

    // Create a new bug report in the backend
    this.bugReportingService
      .post({ data: { ...data.rawValue, email, platform: this.router.url } })
      // Automatically unsubscribe from the observable once the component is destroyed
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          // Reset the form and close the dialog
          this.isSubmitLoading.set(false);
          this.closeDialog();
        },
        error: () => {
          // Reset the form and close the dialog
          this.isSubmitLoading.set(false);
        },
      });
  }
}
