import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { BCDFormManager } from '../../../services/bcd-form-manager';
import { CrudCountries } from '@avalantec/base-app/countries';
import { ProgressBarModule } from 'primeng/progressbar';
import { TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';
import { BcdForm } from '../../../services/bcd-form';
import { FormModule } from '@avalantec/base-app/form';
import { bcdTaxId, bcdTaxType } from '../../../../bcd-taxes';
import { toSignal } from '@angular/core/rxjs-interop';

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
  bcdChargeCodeOptions = this.formManager.bcdChargeCodeOptions;
  bcdAdditionalInformationTypeOptions = this.formManager.bcdAdditionalInformationTypeOptions;
  bcdTaxTypeOptions = this.formManager.bcdTaxTypeOptions;
  bcdTaxIdOptions = this.formManager.bcdTaxIdOptions;
  bcdCpcOptions = this.formManager.bcdCpcOptions;

  // state
  form = this.formService.form;
  loading = this.countriesResource.isLoading;

  // to check records
  currentRecords = toSignal(this.form.controls.records.valueChanges, {
    initialValue: this.form.controls.records.value,
  });

  taxTypeOptionsPerRecord = computed(() => {
    const currentRecords = this.currentRecords();
    const options: { taxTypes: bcdTaxType[] }[] = [];

    // iterate and check
    for (const record of currentRecords) {
      const cpc = this.bcdCpcOptions().find(cpc => cpc._id === record.cpc);

      if (!cpc) {
        options.push({ taxTypes: [] });
        continue;
      }

      options.push({
        taxTypes: cpc.tax.map(tax => tax.taxType),
      });
    }

    return options;
  });

  taxIdOptionsPerTax = computed(() => {
    const currentRecords = this.currentRecords();
    const options: { taxIds: bcdTaxId[] }[][] = [];

    // iterate and check
    for (const record of currentRecords) {
      const currentTaxes = record.tax || [];
      const cpc = this.bcdCpcOptions().find(cpc => cpc._id === record.cpc);
      const recordOptions: { taxIds: bcdTaxId[] }[] = [];

      for (const tax of currentTaxes) {
        const taxType = this.bcdTaxTypeOptions().find(taxType => taxType._id === tax.type);

        if (!taxType || !cpc) {
          recordOptions.push({ taxIds: [] });
          continue;
        }

        recordOptions.push({
          taxIds: cpc.tax.filter(tax => tax.taxType._id === taxType._id).map(tax => tax.taxId),
        });
      }

      options.push(recordOptions);
    }

    return options;
  });
}
