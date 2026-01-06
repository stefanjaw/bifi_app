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
  lineIndex!: number;

  form = signal(this.formService.createInvoiceLineForm());

  price = signal(0);
  quantity = signal(0);
  subtotal = computed(() => this.price() * this.quantity());
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
      this.form().controls.subtotal.setValue(this.subtotal(), {
        emitEvent: false,
      });
    });
  }
  /**
   * Opens the dialog with the given data.
   * @param {Partial<{ invoiceIndex: number }>} data - The data to open the dialog with.
   * @remarks
   * If the data is not provided, the dialog will open with the default values.
   */
  override openDialog(data?: { invoiceIndex: number; lineIndex?: number }) {
    this.shippingIndex = data!.invoiceIndex;
    this.lineIndex = data?.lineIndex ?? -1;

    const form = this.formService.createInvoiceLineForm();

    if (this.lineIndex > -1) {
      const line = this.formService.form.controls.invoices
        .at(this.shippingIndex)
        .controls.extractedData.controls.lines.at(this.lineIndex);

      if (line) {
        form.patchValue(line.value);

        this.price.set(line.controls.price.value ?? 0);
        this.quantity.set(line.controls.quantity.value ?? 0);
      }
    } else {
      // CREATE MODE
      this.price.set(0);
      this.quantity.set(0);
    }

    this.form.set(form);

    super.openDialog();
  }

  /**
   * Submits the form with the given values and closes the dialog.
   * @remarks
   * This function will add the line to the shipping form and close the dialog.
   */
  handleSubmit() {
    this.formService.addLineToShipping(this.shippingIndex, this.lineIndex, this.form());
    this.closeDialog();
  }
}
