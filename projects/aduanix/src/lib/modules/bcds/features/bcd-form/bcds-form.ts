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
import { ActivatedRoute, Router } from '@angular/router';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { ReactiveFormsModule } from '@angular/forms';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { CrudShippings } from '@avalantec/aduanix/modules/shippings';
import { BCDFormManager } from '../../services/bcd-form-manager';
import { bcdFormModel } from '../../interfaces/bcd-form';
import { Tabs, TabsModule } from 'primeng/tabs';
import { BcdsGeneralForm } from './bcds-general-form/bcds-general-form';
import { BcdsRecordsForm } from './bcds-records-form/bcds-records-form';
import { BcdsSummaryForm } from './bcds-summary-form/bcds-summary-form';

@Component({
  selector: 'bifi-app-bcds-form',
  imports: [
    FormModule,
    ReactiveFormsModule,
    ButtonModule,
    ProgressBarModule,
    TabsModule,
    Tabs,
    BcdsGeneralForm,
    BcdsRecordsForm,
    BcdsSummaryForm,
  ],
  templateUrl: './bcds-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BcdsForm {
  private formService = inject(BcdForm);
  protected formManager = inject(BCDFormManager);
  private crudShippings = inject(CrudShippings);
  private crudBCD = inject(CrudBCD);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = input.required<string>();
  shippingId = input.required<string>();

  // resources
  bcdResource = this.crudBCD.get({
    id: this.id,
    triggerRequest: computed(() => this.id() !== undefined),
  });
  shippingResource = this.crudShippings.get({
    id: this.shippingId,
    triggerRequest: computed(() => this.shippingId() !== undefined),
  });

  //data
  bcd = this.bcdResource.value;
  shipping = this.shippingResource.value;

  //state
  form = this.formService.form;
  isLoading = computed(() => this.bcdResource.isLoading() || this.shippingResource.isLoading());
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
    console.log('🚀 ~ BcdsForm ~ handleSubmit ~ data:', data);
    this.isSubmitLoading.set(true);
  }

  /**
   * Navigate back to the list of BCDs.
   *
   * This function navigates back to the list of BCDs when the back button is clicked.
   */
  goBack() {
    this.router.navigate(['../../list'], { relativeTo: this.route });
  }
}
