import { shipping } from './../../../../shippings/interfaces/shipping';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule } from 'dist/base-app/form';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { BcdChargesFormDialog } from '../../bcd-charges-form-dialog/bcd-charges-form-dialog';
import { BcdAdditionalInformationFormDialog } from '../../bcd-additional-information-form-dialog/bcd-additional-information-form-dialog';
import { BcdForm } from '../../../services/bcd-form';
import { BCDFormManager } from '../../../services/bcd-form-manager';
import { CrudCountries } from '@avalantec/base-app/countries';
import { ProgressBarModule } from 'primeng/progressbar';
import { chargeCodeTypeOptions, taxIdTypeOptions, taxTypeOptions } from '../../../libs/bcd-options';
import { TableModule } from 'primeng/table';
import { BcdTaxesFormDialog } from '../../bcd-taxes-form-dialog/bcd-taxes-form-dialog';
import { AccordionModule } from 'primeng/accordion';
import { bcdAdditionalInformationType } from '../../../interfaces/bcd-additional-information-type';

@Component({
  selector: 'bifi-app-bcds-records-form',
  imports: [
    FormModule,
    ReactiveFormsModule,
    ButtonModule,
    SelectModule,
    InputTextModule,
    TextareaModule,
    ProgressBarModule,
    TableModule,
    AccordionModule,
    BcdChargesFormDialog,
    BcdAdditionalInformationFormDialog,
    BcdTaxesFormDialog,
  ],
  templateUrl: './bcds-records-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BcdsRecordsForm {
  // services
  private formService = inject(BcdForm);
  protected formManager = inject(BCDFormManager);
  private crudCountries = inject(CrudCountries);

  // inputs
  shipping = input.required<shipping | undefined>();

  // resources
  countriesResource = this.crudCountries.get({});

  // options
  countryOptions = this.countriesResource.value;

  //charges table
  chargeCodeTypeOptions = chargeCodeTypeOptions;
  bcdAdditionalInformationTypeOptions = input.required<bcdAdditionalInformationType[]>();

  // Tax Options
  taxTypeOptions = taxTypeOptions;
  taxIdTypeOptions = taxIdTypeOptions;

  // state
  form = this.formService.form;
  loading = this.countriesResource.isLoading;
}
