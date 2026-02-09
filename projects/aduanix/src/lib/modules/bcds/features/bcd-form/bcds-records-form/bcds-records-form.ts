import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { BcdChargesFormDialog } from '../../bcd-charges-form-dialog/bcd-charges-form-dialog';
import { BCDFormManager } from '../../../services/bcd-form-manager';
import { CrudCountries } from '@avalantec/base-app/countries';
import { ProgressBarModule } from 'primeng/progressbar';
import { chargeCodeTypeOptions } from '../../../libs/bcd-options';
import { TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';
import { BcdForm } from '../../../services/bcd-form';
import { FormModule } from '@avalantec/base-app/form';
import { BcdAdditionalInformationFormDialog } from '../../../../bcd-additional-information-types';
import { BcdTaxesFormDialog } from '../../../../bcd-taxes';

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

  // resources
  countriesResource = this.crudCountries.get({});

  // options
  countryOptions = this.countriesResource.value;
  chargeCodeTypeOptions = chargeCodeTypeOptions;
  bcdAdditionalInformationTypeOptions = this.formManager.bcdAdditionalInformationTypeOptions;
  bcdTaxTypeOptions = this.formManager.bcdTaxTypeOptions;
  bcdTaxIdOptions = this.formManager.bcdTaxIdOptions;
  bcdCpcOptions = this.formManager.bcdCpcOptions;

  // state
  form = this.formService.form;
  loading = this.countriesResource.isLoading;
}
