import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { CrudBCD } from '../../services/crud-bcd';
import { BcdForm, bcdModel } from '../../services/bcd-form';
import { CrudCountries } from '@avalantec/base-app/countries';
import { CrudContacts } from '@avalantec/base-app/contacts';
import { ActivatedRoute, Router } from '@angular/router';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { TableLayout } from '@avalantec/base-app/resource';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { CrudShippings } from '@avalantec/aduanix/modules/shippings';
import { TransportMethodTypeEnum } from '../../interfaces/bcd-types';

@Component({
  selector: 'bifi-app-bcds-form',
  imports: [
    FormModule,
    ReactiveFormsModule,
    SelectModule,
    InputText,
    ButtonModule,
    ProgressBarModule,
    RadioButtonModule,
    TableLayout,
  ],
  templateUrl: './bcds-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BcdsForm {
  private formService = inject(BcdForm);
  private crudShippings = inject(CrudShippings);
  private crudBCD = inject(CrudBCD);
  private crudCountries = inject(CrudCountries);
  private crudContacts = inject(CrudContacts);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = input.required<string>();
  // idShipping = input.required<string>();

  bcdResource = this.crudBCD.get({
    id: this.id,
    triggerRequest: computed(() => this.id() !== undefined),
  });

  // shippingsResource = this.crudShippings.get({
  //   id: this.idShipping,
  //   triggerRequest: computed(() => this.idShipping() !== undefined),
  // });
  contactsResource = this.crudContacts.get({});
  countriesResource = this.crudCountries.get({});

  //data
  bcd = this.bcdResource.value;
  contactOptions = this.contactsResource.value;
  countryOptions = this.countriesResource.value;

  //state
  form = this.formService.form;

  //Enun Transport type
  transportTypeOptions = Object.values(TransportMethodTypeEnum).map(value => ({
    label: value,
    value,
  }));
  
  isLoading = computed(
    () =>
      this.contactsResource.isLoading() ||
      this.countriesResource.isLoading() ||
      this.bcdResource.isLoading()
  );

  isSubmitLoading = signal(false);
  isUpdate = computed(() => !!this.bcd());
  error = this.bcdResource.error;

  constructor() {
    effect(() => {
      const bcd = this.bcd();

      if (bcd) {
        this.formService.patchValue({
          supplier: {
            contactId: bcd.supplier.contactId._id,
          },
          importer: {
            contactId: bcd.importer.contactId._id,
          },
          transport: {
            type: bcd.transport.type,
            aircraftOrVessel: bcd.transport.aircraftOrVessel,
            flightOrVoyage: bcd.transport.flightOrVoyage,
            port: bcd.transport.port,
            arrivalDate: bcd.transport.arrivalDate,
          },
          manifest: bcd.manifest,
          masterBOLAWB: bcd.masterBOLAWB,
          houseBOLAWB: bcd.houseBOLAWB,
          directShipmentCountry: bcd.directShipmentCountry,
          originalShipmentCountry: bcd.originalShipmentCountry,
          warehouseId: bcd.warehouseId || '',

          charges: bcd.charges.map(c => ({
            code: c.code,
            percentage: c.percentage || 0,
            amount: c.amount,
          })),

          containersIds: bcd.containersIds,
          valuationMethod: bcd.valuationMethod,
          packagesCount: bcd.packagesCount,

          additionalInformation: bcd.additionalInformation.map(a => ({
            type: a.type,
            value: a.value,
          })),

          ogd: {
            paymentCode: bcd.ogd.paymentCode,
            costCode: bcd.ogd.costCode,
            objectCode: bcd.ogd.objectCode,
            subsidiaryCode: bcd.ogd.subsidiaryCode,
            explanation: bcd.ogd.explanation,
          },

          paymentAccounts: bcd.paymentAccounts,

          declarant: {
            name: bcd.declarant.name,
            companyId: bcd.declarant.companyId._id,
            date: bcd.declarant.date.toISOString(),
            capacity: bcd.declarant.capacity,
            traderReference: bcd.declarant.traderReference,
          },

          records: bcd.records.map(r => ({
            number: r.number,
            cpc: r.cpc,
            origin: r.origin,
            tariff: r.tariff,
            description: r.description,
            quantity: r.quantity,
            quantityTwo: r.quantityTwo,
            supplementaryCode: r.supplementaryCode,
            currency: r.currency,
            linesSubtotal: r.linesSubtotal,
            exchangeRate: r.exchangeRate,
            charges: r.charges.map(c => ({
              code: c.code,
              percentage: c.percentage || 0,
              amount: c.amount,
            })),
            tax: r.tax.map(t => ({
              type: t.type,
              taxId: t.taxId,
              valueForTax: t.valueForTax,
              ratePercentage: t.ratePercentage,
              amount: t.amount,
            })),
            additionalInformation: r.additionalInformation.map(a => ({
              type: a.type,
              value: a.value,
            })),
          })),
        });
      }
    });

    this.formService.form.markAllAsTouched();
  }

  async handleSubmit(data: FormValueState<bcdModel>) {
    this.isSubmitLoading.set(true);
  }
}
