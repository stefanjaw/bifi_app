import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseDialog, Text, ToastManager } from '@avalantec/base-app/core';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import {
  UpdateMaintenanceForm,
  UpdateMaintenanceFormModel,
} from '../../services/update-maintenance-form';
import { CrudProductMaintenances } from '../../services/crud-product-maintenances';
import { product, ProductMaintenanceContext } from '../../../products';
import { productMaintenance } from '../../interfaces/product-maintenance';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'bifi-app-product-finish-maintenance-form-dialog',
  imports: [DialogModule, ReactiveFormsModule, FileUploadModule, Text, CommonModule, FormModule],
  templateUrl: './product-finish-maintenance-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductFinishMaintenanceFormDialog extends BaseDialog {
  // services
  protected formService = inject(UpdateMaintenanceForm);
  private productMaintenancesService = inject(CrudProductMaintenances);
  private toastManager = inject(ToastManager);
  private productMaintenanceContext = inject(ProductMaintenanceContext);
  form = this.formService.form;

  // inputs
  product = input.required<product | null>();
  maintenanceType = input.required<productMaintenance['type']>();

  // state
  submitLoading = signal<boolean>(false);
  destroy$ = inject(DestroyRef);
  productMaintenace = computed(() =>
    this.product()?.productMaintenances.find(m => m.type === this.maintenanceType())
  );

  /**
   * Opens the product form dialog and resets the form to its initial state.
   * This ensures that any previously entered data is cleared when the dialog
   * is opened anew.
   */

  override openDialog(): void {
    this.formService.reset();
    this.formService.form.markAsTouched();
    super.openDialog();
  }

  /**
   * Handles the submission of the form and creates a new maintenace record in the backend.
   *
   * @param data the form data
   */
  handleSubmit(data: FormValueState<UpdateMaintenanceFormModel>) {
    this.submitLoading.set(true);

    const { rawValue } = data;

    this.productMaintenancesService
      .put({
        _id: this.productMaintenace()?._id || '',
        data: {
          attachments: rawValue.attachments,
          active: 'false',
        },
      })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.submitLoading.set(false);
          this.formService.reset();
          this.closeDialog();
          this.toastManager.showSuccess(
            `${this.maintenanceType() === 'service' ? 'Service' : 'PM'} finished successfully`
          );

          if (this.maintenanceType() === 'service') {
            this.productMaintenanceContext.handleFinishService();
          } else {
            this.productMaintenanceContext.handleFinishPM();
          }
        },
        error: () => {
          this.submitLoading.set(false);
        },
      });
  }
}
