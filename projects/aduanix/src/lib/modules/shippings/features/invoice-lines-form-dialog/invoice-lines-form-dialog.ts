import {
  ChangeDetectionStrategy,
  Component,
  inject,
  computed,
  signal,
  effect,
  DestroyRef,
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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@avalantec/base-app/i18n';

@Component({
  selector: 'bifi-app-invoice-lines-form-dialog',
  imports: [
    DialogModule,
    ReactiveFormsModule,
    FormModule,
    SelectModule,
    InputTextModule,
    TextareaModule,
    TranslatePipe,
  ],
  templateUrl: './invoice-lines-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceLinesFormDialog extends BaseDialog {
  // Services
  protected formService = inject(ShippingForm);
  private crudCountries = inject(CrudCountries);
  private destroy$ = inject(DestroyRef);

  invoiceIndex!: number;
  lineIndex: number = -1;

  form = signal(this.formService.createInvoiceLineForm());

  price = signal<number>(0);
  quantity = signal<number>(0);
  subtotal = computed(() => this.price() * this.quantity());
  // Resources
  countriesResource = this.crudCountries.get({
    triggerRequest: this.dialogState,
  });

  // Data
  countries = this.countriesResource.value;

  // State
  loading = computed(() => this.countriesResource.isLoading());

  constructor() {
    super();

    effect(() => {
      this.form().controls.subtotal.setValue(this.subtotal(), {
        emitEvent: false,
      });
      const form = this.form();

      if (!form) return;

      form.controls.price.valueChanges
        .pipe(takeUntilDestroyed(this.destroy$))
        .subscribe(value => this.price.set(value));
      form.controls.quantity.valueChanges
        .pipe(takeUntilDestroyed(this.destroy$))
        .subscribe(value => this.quantity.set(value));
    });

    effect(() => {
      const form = this.form();
      const subtotal = this.subtotal();

      if (!form) return;

      form.controls.subtotal.setValue(subtotal, { emitEvent: false });
    });
  }

  /**
   * Opens the dialog for adding a new line or editing an existing one.
   *
   * @param invoiceIndex - Index of the invoice to add/edit the line in.
   * @param lineIndex - Index of the line to edit (-1 means adding a new line).
   */
  override openDialog(invoiceIndex = -1, lineIndex = -1) {
    this.invoiceIndex = invoiceIndex;
    this.lineIndex = lineIndex;

    const form = this.formService.createInvoiceLineForm();
    this.price.set(0);
    this.quantity.set(0);

    if (lineIndex >= 0) {
      const existingLine = this.formService.form.controls.invoices
        .at(invoiceIndex)
        .controls.extractedData.controls.lines.at(lineIndex)
        .getRawValue();

      // Cast required: nested FormGroup raw value type does not align with
      // patchValue's generic constraint on the sibling FormGroup.
      form.patchValue(existingLine as Parameters<typeof form.patchValue>[0]);
      this.price.set(existingLine.price ?? 0);
      this.quantity.set(existingLine.quantity ?? 0);
    }

    this.form.set(form);

    super.openDialog();
  }

  /**
   * Submits the form with the given values and closes the dialog.
   * Adds or updates the line in the shipping form depending on lineIndex.
   */
  handleSubmit() {
    this.formService.addLineToShipping(this.invoiceIndex, this.lineIndex, this.form());
    this.closeDialog();
  }
}
