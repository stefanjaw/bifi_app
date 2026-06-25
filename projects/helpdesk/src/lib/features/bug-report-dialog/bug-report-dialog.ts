import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { BugReportForm, BugReportFormModel } from '../../services/bug-report-form';
import { CrudTickets } from '../../services/crud-tickets';
import { BaseDialog } from '@avalantec/base-app/core';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule } from 'primeng/fileupload';
import { injectAuthService } from '@avalantec/base-app/auth';

@Component({
  selector: 'bifi-app-helpdesk-bug-report-dialog',
  imports: [
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    FormModule,
    FileUploadModule,
  ],
  templateUrl: './bug-report-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BugReportDialog extends BaseDialog {
  protected formService = inject(BugReportForm);
  private destroy$ = inject(DestroyRef);
  private crudTickets = inject(CrudTickets);
  private authService = injectAuthService();

  form = this.formService.form;
  isSubmitLoading = signal(false);

  override openDialog(): void {
    this.formService.reset();
    super.openDialog();
  }

  handleSubmit(data: FormValueState<BugReportFormModel>) {
    this.isSubmitLoading.set(true);

    const email = this.authService.user()?.email;

    this.crudTickets
      .post({
        data: {
          name: data.rawValue.name,
          description: data.rawValue.description,
          category: email,
          appModule: window.location.href,
          attachments: data.rawValue.files,
        } as any,
        fileFields: ['attachments'],
      })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.isSubmitLoading.set(false);
          this.closeDialog();
        },
        error: () => {
          this.isSubmitLoading.set(false);
        },
      });
  }
}
