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
  protected formService = inject(ShippingForm);
  private crudCountries = inject(CrudCountries);

  form = this.formService.form;

  countriesResource = this.crudCountries.get({});

  countries = this.countriesResource.value;

  // State
  loading = computed(() => this.countriesResource.isLoading());

  submitLoading = signal<boolean>(false);
  destroy$ = inject(DestroyRef);


  override openDialog(): void {
    super.openDialog();
  }
}
