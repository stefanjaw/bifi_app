import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { BaseDialog, Text } from '@avalantec/base-app/core';
import {
  SkipMaintenanceForm,
  SkipMaintenanceFormModel,
} from '../../services/skip-maintenance-form';
import { CrudProducts, product, ProductMaintenanceContext } from '../../../products';
import { DialogModule } from 'primeng/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { TextareaModule } from 'primeng/textarea';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'bifi-app-product-skip-maintenance-form-dialog',
  imports: [DialogModule, ReactiveFormsModule, FormModule, TextareaModule, CommonModule, Text],
  templateUrl: './product-skip-maintenance-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductSkipMaintenanceFormDialog extends BaseDialog {
  // services
  private formService = inject(SkipMaintenanceForm);
  private crudProducts = inject(CrudProducts);
  private productMaintenanceContext = inject(ProductMaintenanceContext);
  form = this.formService.form;

  // inputs
  product = input.required<product | undefined>();

  // state
  submitLoading = signal<boolean>(false);
  destroy$ = inject(DestroyRef);

  override openDialog(): void {
    this.formService.reset();
    this.formService.form.markAsTouched();
    this.formService.form.markAsDirty();
    super.openDialog();
  }

  handleSubmit(data: FormValueState<SkipMaintenanceFormModel>) {
    this.submitLoading.set(true);

    this.crudProducts
      .put({
        _id: this.product()?._id || '',
        data: data.rawValue,
        specificEndpoint: 'skip-pm',
      })
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.productMaintenanceContext.handleSkipPM();
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
