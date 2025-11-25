import { ProductMaintenanceContext } from '../../../products';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  CreateCommissioningForm,
  CreateCommissioningFormModel,
} from '../../services/create-commissioning-form';
import { DialogModule } from 'primeng/dialog';
import { product } from '../../../products/interfaces/product';
import { BaseDialog, Text, ToastManager } from '@avalantec/base-app/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { Textarea } from 'primeng/textarea';
import { CrudProductCommissioning } from '../../services/crud-product-commissioning';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FileUploadModule } from 'primeng/fileupload';
import { FormModule, FormValueState } from '@avalantec/base-app/form';

@Component({
  selector: 'bifi-app-product-commissioning-form-dialog',
  imports: [
    DialogModule,
    ReactiveFormsModule,
    Text,
    RadioButtonModule,
    Textarea,
    FileUploadModule,
    FormModule,
  ],
  templateUrl: './product-commissioning-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCommissioningFormDialog extends BaseDialog {
  // services
  protected formService = inject(CreateCommissioningForm);
  private productCommissioningService = inject(CrudProductCommissioning);
  private toastManager = inject(ToastManager);
  private productMaintenanceContext = inject(ProductMaintenanceContext);
  form = this.formService.form;

  // inputs
  product = input.required<product | undefined>();

  // state
  submitLoading = signal<boolean>(false);
  destroy$ = inject(DestroyRef);

  /**
   * Opens the product form dialog and resets the form to its initial state.
   * This ensures that any previously entered data is cleared when the dialog
   * is opened anew.
   */

  override openDialog(): void {
    this.formService.reset();
    super.openDialog();
  }

  /**
   * Handles the submission of the form and creates a new commissioning record in the backend.
   *
   * @param data the form data
   */
  handleSubmit(data: FormValueState<CreateCommissioningFormModel>) {
    this.submitLoading.set(true);

    const { rawValue } = data;

    this.productCommissioningService
      .post({
        data: {
          productId: this.product()?._id,
          outcome: rawValue.outcome,
          details: rawValue.details || '',
          ...(rawValue.attachments && { attachments: rawValue.attachments }),
        },
      })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.submitLoading.set(false);
          this.formService.reset();
          this.closeDialog();
          this.productMaintenanceContext.handleCommission();
          this.toastManager.showSuccess('commissioning created successfully');
        },
        error: () => {
          this.submitLoading.set(false);
        },
      });
  }
}
