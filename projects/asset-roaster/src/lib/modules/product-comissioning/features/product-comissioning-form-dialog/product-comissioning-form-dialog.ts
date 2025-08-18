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
  CreateComissioningForm,
  CreateComissioningFormModel,
} from '../../services/create-comissioning-form';
import { DialogModule } from 'primeng/dialog';
import { product } from '../../../products/interfaces/product';
import { BaseDialog, Text, ToastManager } from '@avalantec/base-app/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RadioButtonModule } from 'primeng/radiobutton';
import { Textarea } from 'primeng/textarea';
import { CrudProductComissioning } from '../../services/crud-product-comissioning';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FileUploadModule } from 'primeng/fileupload';
import { FormModule, FormValueState } from '@avalantec/base-app/form';

@Component({
  selector: 'bifi-app-product-comissioning-form-dialog',
  imports: [
    DialogModule,
    ReactiveFormsModule,
    Text,
    RadioButtonModule,
    Textarea,
    FileUploadModule,
    FormModule,
  ],
  templateUrl: './product-comissioning-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductComissioningFormDialog extends BaseDialog {
  // services
  protected formService = inject(CreateComissioningForm);
  private productComissioningService = inject(CrudProductComissioning);
  private toastManager = inject(ToastManager);
  private productMaintenanceContext = inject(ProductMaintenanceContext);
  form = this.formService.form;

  // inputs
  product = input.required<product | null>();

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
   * Handles the submission of the form and creates a new comissioning record in the backend.
   *
   * @param data the form data
   */
  handleSubmit(data: FormValueState<CreateComissioningFormModel>) {
    this.submitLoading.set(true);

    const { rawValue } = data;

    this.productComissioningService
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
          this.productMaintenanceContext.handleComission();
          this.toastManager.showSuccess('Comissioning created successfully');
        },
        error: () => {
          this.submitLoading.set(false);
        },
      });
  }
}
