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
import { BcdForm } from '../../services/bcd-form';
import { CrudCountries } from '@avalantec/base-app/countries';
import { CrudContacts } from '@avalantec/base-app/contacts';
import { ActivatedRoute, Router } from '@angular/router';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { CrudShippings } from '@avalantec/aduanix/modules/shippings';
import { TransportMethodType } from '../../interfaces/bcd-types';
import { DatePickerModule } from 'primeng/datepicker';
import { BCDFormManager } from '../../services/bcd-form-manager';
import { bcdFormModel } from '../../interfaces/bcd-form';
import { TableModule } from 'primeng/table';
import { additionalInformationTypeOptions, chargeCodeTypeOptions, transportMethodTypeOptions } from '../../libs/bcd-options';
import { toSignal } from '@angular/core/rxjs-interop';
import { TextareaModule } from 'primeng/textarea';
import { Tabs, TabsModule } from 'primeng/tabs';
import { BcdChargesFormDialog } from '../bcd-charges-form-dialog/bcd-charges-form-dialog';
import { BcdAdditionalInformationFormDialog } from '../bcd-additional-information-form-dialog/bcd-additional-information-form-dialog';

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
    TableModule,
    DatePickerModule,
    TextareaModule,
    TabsModule,
    Tabs,
    BcdChargesFormDialog,
    BcdAdditionalInformationFormDialog,
  ],
  templateUrl: './bcds-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BcdsForm {
  private formService = inject(BcdForm);
  protected formManager = inject(BCDFormManager);
  private crudShippings = inject(CrudShippings);
  private crudBCD = inject(CrudBCD);
  private crudCountries = inject(CrudCountries);
  private crudContacts = inject(CrudContacts);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = input.required<string>();
  shippingId = input.required<string>();

  bcdResource = this.crudBCD.get({
    id: this.id,
    triggerRequest: computed(() => this.id() !== undefined),
  });
  shippingResource = this.crudShippings.get({
    id: this.shippingId,
    triggerRequest: computed(() => this.shippingId() !== undefined),
  });

  contactsResource = this.crudContacts.get({});
  countriesResource = this.crudCountries.get({});

  //data
  bcd = this.bcdResource.value;
  shipping = this.shippingResource.value;
  contactOptions = this.contactsResource.value;
  countryOptions = this.countriesResource.value;
  transportMethodTypeOptions = transportMethodTypeOptions;
  chargeCodeTypeOptions = chargeCodeTypeOptions;
  additionalInformationTypeOptions = additionalInformationTypeOptions;

  //state
  form = this.formService.form;
  currentTransportMethodType = toSignal(
    this.formService.form.controls.transport.controls.type.valueChanges,
    {
      initialValue: this.formService.form.controls.transport.controls.type.value,
    }
  );

  isLoading = computed(
    () =>
      this.contactsResource.isLoading() ||
      this.countriesResource.isLoading() ||
      this.bcdResource.isLoading() ||
      this.shippingResource.isLoading()
  );

  isSubmitLoading = signal(false);
  isUpdate = computed(() => !!this.bcd());
  error = this.bcdResource.error;

  constructor() {
    effect(() => {
      const bcd = this.bcd();

      if (bcd) {
        this.formService.patchValue({
          shippingId: bcd.shippingId?._id,
          type: bcd.type,
          supplier: {
            contactId: bcd.supplier.contactId?._id,
          },
          importer: {
            contactId: bcd.importer.contactId?._id,
          },
          transport: {
            type: bcd.transport?.type,
            aircraftOrVessel: bcd.transport?.aircraftOrVessel,
            flightOrVoyage: bcd.transport?.flightOrVoyage,
            port: bcd.transport?.port,
            arrivalDate: new Date(bcd.transport.arrivalDate),
          },
          manifest: bcd.manifest,
          masterBOLAWB: bcd.masterBOLAWB,
          houseBOLAWB: bcd.houseBOLAWB,
          directShipmentCountry: bcd.directShipmentCountry?._id,
          originalShipmentCountry: bcd.originalShipmentCountry?._id,
          warehouseId: bcd.warehouseId,
          charges: bcd.charges?.map(c => ({
            code: c.code,
            percentage: c.percentage || 0,
            amount: c.amount,
          })),
          containersIds: bcd.containersIds,
          valuationMethod: bcd.valuationMethod,
          packagesCount: bcd.packagesCount,
          additionalInformation: bcd.additionalInformation?.map(a => ({
            type: a.type,
            value: a.value,
          })),
          ogd: {
            paymentCode: bcd.ogd?.paymentCode,
            costCode: bcd.ogd?.costCode,
            objectCode: bcd.ogd?.objectCode,
            subsidiaryCode: bcd.ogd?.subsidiaryCode,
            explanation: bcd.ogd?.explanation,
          },
          paymentAccounts: bcd.paymentAccounts,
          declarant: {
            name: bcd.declarant?.name,
            companyId: bcd.declarant?.companyId,
            date: new Date(bcd.declarant.date),
            capacity: bcd.declarant?.capacity,
            traderReference: bcd.declarant?.traderReference,
          },
          records:
            bcd.records?.map(r => ({
              number: r.number,
              cpc: r.cpc,
              origin: r.origin?._id,
              tariff: r.tariff,
              description: r.description,
              quantity: r.quantity,
              quantityTwo: r.quantityTwo,
              supplementaryCode: r.supplementaryCode,
              currency: r.currency,
              linesSubtotal: r.linesSubtotal,
              exchangeRate: r.exchangeRate,
              charges: r.charges?.map(c => ({
                code: c.code,
                percentage: c.percentage || 0,
                amount: c.amount,
              })),
              tax: r.tax?.map(t => ({
                type: t.type,
                taxId: t.taxId,
                valueForTax: t.valueForTax,
                ratePercentage: t.ratePercentage,
                amount: t.amount,
              })),
              additionalInformation: r.additionalInformation?.map(a => ({
                type: a.type,
                value: a.value,
              })),
            })) || [],
        });
      } else {
        this.formService.reset();
      }
    });

    this.formService.form.markAllAsTouched();
  }

  async handleSubmit(data: FormValueState<bcdFormModel>) {
    this.isSubmitLoading.set(true);
  }
}
