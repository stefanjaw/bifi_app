import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  computed,
  signal,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { BaseDialog } from '@avalantec/base-app/core';
import { ShippingForm } from '../../services/shipping-form';
import { CrudCountries } from '@avalantec/base-app/countries';
import { SelectModule } from 'primeng/select';
import { FormModule } from '@avalantec/base-app/form';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'bifi-app-invoice-lines-form-dialog',
  imports: [DialogModule, ReactiveFormsModule, FormModule, SelectModule],
  templateUrl: './invoice-lines-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceLinesFormDialog extends BaseDialog {
  // Services
  protected formService = inject(ShippingForm);
  private crudCountries = inject(CrudCountries);

  shippingIndex!: number;
  form = this.formService.createInvoiceLineDialogForm();

  // Resources
  countriesResource = this.crudCountries.get({
    triggerRequest: this.dialogState,
  });

  // Data
  countries = this.countriesResource.value;

  // State
  loading = computed(() => this.countriesResource.isLoading());
  destroy$ = inject(DestroyRef);
  isSubmitLoading = signal(false);

  override openDialog(data?: { shippingIndex: number }) {
    this.shippingIndex = data!.shippingIndex;
    //this.form.reset();
    super.openDialog();
  }

  handleSubmit() {
    this.formService.addLineToShipping(this.shippingIndex, this.form.getRawValue());
    this.closeDialog();
  }
}
