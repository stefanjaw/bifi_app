import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
    BcdChargesFormDialog,
    BcdAdditionalInformationFormDialog,
  ],
  templateUrl: './bcds-records-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BcdsRecordsForm {
  private formService = inject(BcdForm);
  protected formManager = inject(BCDFormManager);
  private crudCountries = inject(CrudCountries);

  form = this.formService.form;

  // resources
  countriesResource = this.crudCountries.get({});

  // options
  countryOptions = this.countriesResource.value;

  // state
  loading = this.countriesResource.isLoading;
}
