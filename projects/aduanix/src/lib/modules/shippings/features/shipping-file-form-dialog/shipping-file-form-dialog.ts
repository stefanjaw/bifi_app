import { ChangeDetectionStrategy, Component, DestroyRef, inject, output, signal } from '@angular/core';
import { BaseDialog, Text } from '@avalantec/base-app/core';
import { ShippingFileForm, ShippingFileFormModel } from '../../services/shipping-file-form';
import { CrudShippings } from '../../services/crud-shippings';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { FileUploadModule } from 'primeng/fileupload';

@Component({
  selector: 'bifi-app-shipping-file-form-dialog',
  imports: [DialogModule, ReactiveFormsModule, FileUploadModule, FormModule, Text],
  templateUrl: './shipping-file-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShippingFileFormDialog extends BaseDialog {
  protected formService = inject(ShippingFileForm);
  private crudShippings = inject(CrudShippings);
  form = this.formService.form;

  // state
  submitLoading = signal<boolean>(false);
  destroy$ = inject(DestroyRef);
  shippingCreated = output<void>();

  override openDialog(): void {
    this.formService.reset();
    super.openDialog();
  }

  handleSubmit(data: FormValueState<ShippingFileFormModel>) {
    this.submitLoading.set(true);

    const { rawValue } = data;

    this.crudShippings
      .post({
        data: {
          ...(rawValue.file && rawValue.file.length > 0 && { file: rawValue.file[0] }),
        },
        specificEndpoint: 'from-file',
      })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.submitLoading.set(false);
          this.formService.reset();
          this.closeDialog();
        },
        error: () => {
          this.submitLoading.set(false);
        },
      });
  }
}
