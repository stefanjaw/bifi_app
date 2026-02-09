import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BcdForm } from '../../../services/bcd-form';
import { BCDFormManager } from '../../../services/bcd-form-manager';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule } from '@avalantec/base-app/form';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { valuationMethodTypeOptions } from '../../../libs/bcd-options';
import { DatePickerModule } from 'primeng/datepicker';
import { CrudContacts } from '@avalantec/base-app/contacts';
import { CrudCountries } from '@avalantec/base-app/countries';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { BcdChargesFormDialog } from '../../../../bcd-charge-codes';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { BcdAdditionalInformationFormDialog } from '../../../../bcd-additional-information-types';
@Component({
  selector: 'bifi-app-bcds-general-form',
  imports: [
    ReactiveFormsModule,
    FormModule,
    SelectModule,
    ButtonModule,
    TableModule,
    DatePickerModule,
    InputTextModule,
    TextareaModule,
    ProgressBarModule,
    BcdChargesFormDialog,
    BcdAdditionalInformationFormDialog,
    RadioButtonModule,
  ],
  templateUrl: './bcds-general-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BcdsGeneralForm {
  private formService = inject(BcdForm);
  protected formManager = inject(BCDFormManager);
  private crudCountries = inject(CrudCountries);
  private crudContacts = inject(CrudContacts);

  form = this.formService.form;

  // resources
  contactsResource = this.crudContacts.get({});
  countriesResource = this.crudCountries.get({});

  // options
  contactOptions = this.contactsResource.value;
  countryOptions = this.countriesResource.value;
  bcdTypeOptions = this.formManager.bcdTypeOptions;
  bcdTransportOptions = this.formManager.bcdTransportOptions;
  bcdAdditionalInformationTypeOptions = this.formManager.bcdAdditionalInformationTypeOptions;
  bcdChargeCodeOptions = this.formManager.bcdChargeCodeOptions;
  bcdPortOptions = this.formManager.bcdPortOptions;
  valuationMethodTypeOptions = valuationMethodTypeOptions;
}
