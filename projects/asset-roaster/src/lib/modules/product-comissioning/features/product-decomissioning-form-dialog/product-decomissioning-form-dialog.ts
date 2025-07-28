import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnDestroy,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseDialog, Text, ToastManager } from '@avalantec/base-app/core';
import { AppFormExtensionsImports, FormValueState } from '@avalantec/base-app/form';
import { DialogModule } from 'primeng/dialog';
import { Textarea } from 'primeng/textarea';
import { CrudProducts, product, ProductMaintenanceContext } from '../../../products';
import { CrudProductComissioning } from '../../services/crud-product-comissioning';
import { forkJoin, Subject, takeUntil } from 'rxjs';
import { DecomissioningForm, DecomissioningFormModel } from '../../services/decomissioning-form';

@Component({
  selector: 'bifi-app-product-decomissioning-form-dialog',
  imports: [DialogModule, ReactiveFormsModule, AppFormExtensionsImports, Text, Textarea],
  templateUrl: './product-decomissioning-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDecomissioningFormDialog extends BaseDialog implements OnDestroy {
  // services
  private formService = inject(DecomissioningForm);
  private productComissioningService = inject(CrudProductComissioning);
  private productsService = inject(CrudProducts);
  private productMaintenanceContext = inject(ProductMaintenanceContext);
  private toastManager = inject(ToastManager);
  form = this.formService.form;

  // inputs
  product = input.required<product | null>();

  // state
  submitLoading = signal<boolean>(false);
  destroy$ = new Subject<void>();

  /**
   * Destroys the component, unsubscribing from the destroy subject.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }

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
   * Handles the submission of the form and sets the product status to 'decomissioned',
   * while also updating the product comissioning record to set it as inactive.
   *
   * @param data the form data
   */
  handleSubmit(data: FormValueState<DecomissioningFormModel>) {
    this.submitLoading.set(true);

    const productComissionnigRequest = this.productComissioningService.put({
      _id: this.product()?.productComission?._id || '',
      data: {
        active: false,
        details: data.rawValue.details || '',
      },
    });

    const productsRequest = this.productsService.put({
      _id: this.product()?._id || '',
      data: {
        status: 'decomissioned',
      },
    });

    forkJoin([productComissionnigRequest, productsRequest])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.submitLoading.set(false);
          this.formService.reset();
          this.closeDialog();
          this.productMaintenanceContext.handleDecomission();
          this.toastManager.showSuccess('Decomissioned successfully');
        },
        error: () => {
          this.submitLoading.set(false);
        },
      });
  }
}
