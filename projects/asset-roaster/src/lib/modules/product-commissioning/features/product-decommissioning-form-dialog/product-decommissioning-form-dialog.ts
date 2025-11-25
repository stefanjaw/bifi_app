import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseDialog, Text, ToastManager } from '@avalantec/base-app/core';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { DialogModule } from 'primeng/dialog';
import { Textarea } from 'primeng/textarea';
import { product, ProductMaintenanceContext } from '../../../products';
import { CrudProductCommissioning } from '../../services/crud-product-commissioning';
import {
  UpdateDecommissioningForm,
  UpdateDecommissioningFormModel,
} from '../../services/update-decommissioning-form';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'bifi-app-product-decommissioning-form-dialog',
  imports: [DialogModule, ReactiveFormsModule, Text, Textarea, FormModule],
  templateUrl: './product-decommissioning-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDecommissioningFormDialog extends BaseDialog {
  // services
  private formService = inject(UpdateDecommissioningForm);
  private productCommissioningService = inject(CrudProductCommissioning);
  private productMaintenanceContext = inject(ProductMaintenanceContext);
  private toastManager = inject(ToastManager);
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
   * Handles the submission of the form and decommissions the product.
   * @param data the form data
   */
  handleSubmit(data: FormValueState<UpdateDecommissioningFormModel>) {
    this.submitLoading.set(true);

    this.productCommissioningService
      .put({
        _id: this.product()?.productCommission?._id || '',
        data: {
          details: data.rawValue.details || '',
        },
        specificEndpoint: 'decommission',
      })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.submitLoading.set(false);
          this.formService.reset();
          this.productMaintenanceContext.handleDecommission();
          this.toastManager.showSuccess('Decommissioned successfully');
          this.closeDialog();
        },
        error: () => {
          this.submitLoading.set(false);
        },
      });
  }
}
