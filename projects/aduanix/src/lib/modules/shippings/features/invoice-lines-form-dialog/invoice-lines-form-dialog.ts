import {
  ChangeDetectionStrategy,
  Component,
  inject,
  computed,
  signal,
  effect,
} from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { BaseDialog } from '@avalantec/base-app/core';
import { ShippingForm } from '../../services/shipping-form';
import { CrudCountries } from '@avalantec/base-app/countries';
import { SelectModule } from 'primeng/select';
import { FormModule } from '@avalantec/base-app/form';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';

@Component({
  selector: 'bifi-app-invoice-lines-form-dialog',
  imports: [
    DialogModule,
    ReactiveFormsModule,
    FormModule,
    SelectModule,
    InputTextModule,
    TextareaModule,
  ],
  templateUrl: './invoice-lines-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceLinesFormDialog extends BaseDialog {
  // Services
  protected formService = inject(ShippingForm);
  private crudCountries = inject(CrudCountries);

  shippingIndex!: number;

  form = signal(this.formService.createInvoiceLineForm());

  price = toSignal(
    this.form().controls.price.valueChanges.pipe(startWith(this.form().controls.price.value)),
    { initialValue: 0 }
  );

  quantity = toSignal(
    this.form().controls.quantity.valueChanges.pipe(startWith(this.form().controls.quantity.value)),
    { initialValue: 0 }
  );

  subtotal = computed(() => Number(this.price()) * Number(this.quantity()));

  // Resources
  countriesResource = this.crudCountries.get({
    triggerRequest: this.dialogState,
  });

  // Data
  countries = this.countriesResource.value;

  // State
  loading = computed(() => this.countriesResource.isLoading());
  isSubmitLoading = signal(false);

  constructor() {
    super();

    effect(() => {
      this.form().controls.subtotal.setValue(this.subtotal());
    });
  }
  /**
   * Opens the dialog with the given data.
   * @param {Partial<{ invoiceIndex: number }>} data - The data to open the dialog with.
   * @remarks
   * If the data is not provided, the dialog will open with the default values.
   */
  override openDialog(data?: { invoiceIndex: number }) {
    this.shippingIndex = data!.invoiceIndex;
    this.form.set(this.formService.createInvoiceLineForm());

    super.openDialog();
  }

  /**
   * Submits the form with the given values and closes the dialog.
   * @remarks
   * This function will add the line to the shipping form and close the dialog.
   */
  handleSubmit() {
    this.formService.addLineToShipping(this.shippingIndex, this.form());
    this.closeDialog();
  }
}
