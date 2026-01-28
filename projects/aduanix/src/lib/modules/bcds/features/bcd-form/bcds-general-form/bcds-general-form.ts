import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { BcdForm } from '../../../services/bcd-form';
import { BCDFormManager } from '../../../services/bcd-form-manager';
import { ReactiveFormsModule } from '@angular/forms';
import { FormModule } from '@avalantec/base-app/form';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import {
  additionalInformationTypeOptions,
  chargeCodeTypeOptions,
  transportMethodTypeOptions,
} from '../../../libs/bcd-options';
import { RadioButtonModule } from 'primeng/radiobutton';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePickerModule } from 'primeng/datepicker';
import { CrudContacts } from '@avalantec/base-app/contacts';
import { CrudCountries } from '@avalantec/base-app/countries';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { BcdAdditionalInformationFormDialog } from '../../bcd-additional-information-form-dialog/bcd-additional-information-form-dialog';
import { BcdChargesFormDialog } from '../../bcd-charges-form-dialog/bcd-charges-form-dialog';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'bifi-app-bcds-general-form',
  imports: [
    ReactiveFormsModule,
    FormModule,
    SelectModule,
    ButtonModule,
    TableModule,
    RadioButtonModule,
    DatePickerModule,
    InputTextModule,
    TextareaModule,
    ProgressBarModule,
    BcdChargesFormDialog,
    BcdAdditionalInformationFormDialog,
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
  transportMethodTypeOptions = transportMethodTypeOptions;
  chargeCodeTypeOptions = chargeCodeTypeOptions;
  additionalInformationTypeOptions = additionalInformationTypeOptions;

  // State
  currentTransportMethodType = toSignal(
    this.formService.form.controls.transport.controls.type.valueChanges,
    {
      initialValue: this.formService.form.controls.transport.controls.type.value,
    }
  );

  loading = computed(() => this.contactsResource.isLoading() || this.countriesResource.isLoading());
}
