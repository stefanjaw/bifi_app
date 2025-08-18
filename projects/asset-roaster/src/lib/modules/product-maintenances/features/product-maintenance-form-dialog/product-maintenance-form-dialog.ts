import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { product, ProductMaintenanceContext } from '../../../products';
import { BaseDialog, Text, ToastManager } from '@avalantec/base-app/core';
import {
  CreateMaintenanceForm,
  CreateMaintenanceFormModel,
} from '../../services/create-maintenance-form';
import { CrudProductMaintenances } from '../../services/crud-product-maintenances';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { Textarea } from 'primeng/textarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormModule, FormValueState } from '@avalantec/base-app/form';

@Component({
  selector: 'bifi-app-product-maintenance-form-dialog',
  imports: [DialogModule, ReactiveFormsModule, Text, Textarea, RadioButtonModule, FormModule],
  templateUrl: './product-maintenance-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductMaintenanceFormDialog extends BaseDialog {
  // services
  protected formService = inject(CreateMaintenanceForm);
  private productMaintenancesService = inject(CrudProductMaintenances);
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
   * Handles the submission of the form and creates a new maintenace record in the backend.
   *
   * @param data the form data
   */
  handleSubmit(data: FormValueState<CreateMaintenanceFormModel>) {
    this.submitLoading.set(true);

    const { rawValue } = data;

    this.productMaintenancesService
      .post({
        data: {
          productId: this.product()?._id,
          name: rawValue.name,
          description: rawValue.description || '',
          type: 'service',
        },
      })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.submitLoading.set(false);
          this.formService.reset();
          this.closeDialog();
          this.productMaintenanceContext.handleService();
          this.toastManager.showSuccess('Service created successfully');
        },
        error: () => {
          this.submitLoading.set(false);
        },
      });
  }
}
