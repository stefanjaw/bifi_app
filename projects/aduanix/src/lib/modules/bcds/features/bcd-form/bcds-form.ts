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
import { ActivatedRoute, Router } from '@angular/router';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { ReactiveFormsModule } from '@angular/forms';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';
import { CrudShippings, invoicePDF } from '@avalantec/aduanix/modules/shippings';
import { BCDFormManager } from '../../services/bcd-form-manager';
import { Tabs, TabsModule } from 'primeng/tabs';
import { BcdsGeneralForm } from './bcds-general-form/bcds-general-form';
import { BcdsRecordsForm } from './bcds-records-form/bcds-records-form';
import { BcdsSummaryForm } from './bcds-summary-form/bcds-summary-form';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Text, ToastManager } from '@avalantec/base-app/core';
import { FileResolver } from '@avalantec/base-app/resource';
import { CrudBCDAdditionalInformationType } from '../../services/crud-bcd-additional-information-type';
import { CrudBCDType } from '../../services/crud-bcd-type';
import { BcdForm } from '../../services/bcd-form';
import { bcdFormModel } from '../../interfaces/bcd-form.types';

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
    Text,
  ],
  templateUrl: './bcds-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BcdsForm {
  private formService = inject(BcdForm);
  protected formManager = inject(BCDFormManager);
  private crudShippings = inject(CrudShippings);
  private crudBCD = inject(CrudBCD);
  private crudBCDAdditionalInformationTypes = inject(CrudBCDAdditionalInformationType);
  private crudBCDTypes = inject(CrudBCDType);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toastManager = inject(ToastManager);
  private fileResolver = inject(FileResolver);

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
  bcdAdditionalInformationTypeResource = this.crudBCDAdditionalInformationTypes.get({});
  bcdTypeResource = this.crudBCDTypes.get({});

  //data
  bcd = this.bcdResource.value;
  shipping = this.shippingResource.value;
  bcdAdditionalInformationTypes = this.bcdAdditionalInformationTypeResource.value;
  bcdTypes = this.bcdTypeResource.value;

  //state
  form = this.formService.form;
  isLoading = computed(
    () =>
      this.bcdResource.isLoading() ||
      this.shippingResource.isLoading() ||
      this.bcdAdditionalInformationTypeResource.isLoading() ||
      this.bcdTypeResource.isLoading()
  );
  isSubmitLoading = signal(false);
  isFtpSubmitLoading = signal(false);
  isUpdate = computed(() => !!this.bcd());
  isUploaded = computed(() => this.bcd()?.status !== 'DRAFT');
  error = this.bcdResource.error;

  /**
   * Constructor
   *
   * If the bcd exists, it will patch the form with the bcd data.
   * If the shipping exists, it will patch the form with the shipping data.
   */
  constructor() {
    effect(() => {
      const bcd = this.bcd();

      if (bcd) {
        this.formService.patchValue({
          shippingId: bcd.shippingId?._id,
          type: bcd.type._id,
          supplier: {
            contactId: bcd.supplier.contactId?._id,
          },
          importer: {
            contactId: bcd.importer.contactId?._id,
          },
          transport: {
            aircraftOrVessel: bcd.transport?.aircraftOrVessel?._id,
            flightOrVoyage: bcd.transport?.flightOrVoyage,
            port: bcd.transport?.port,
            arrivalDate: new Date(bcd.transport.arrivalDate),
          },
          manifest: bcd.manifest,
          masterBOLAWB: bcd.masterBOLAWB,
          houseBOLAWB: bcd.houseBOLAWB || [],
          directShipmentCountry: bcd.directShipmentCountry?._id,
          originalShipmentCountry: bcd.originalShipmentCountry?._id,
          warehouseId: bcd.warehouseId,
          charges:
            bcd.charges?.map(c => ({
              code: c.code,
              percentage: c.percentage || 0,
              amount: c.amount,
            })) || [],
          containerIds: bcd.containerIds,
          valuationMethod: bcd.valuationMethod,
          packagesCount: bcd.packagesCount,
          additionalInformation:
            bcd.additionalInformation?.map(a => ({
              type: a.type._id,
              value: a.value,
            })) || [],
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
              charges:
                r.charges?.map(c => ({
                  code: c.code,
                  percentage: c.percentage || 0,
                  amount: c.amount,
                })) || [],
              tax:
                r.tax?.map(t => ({
                  type: t.type?._id,
                  taxId: t.taxId?._id,
                  valueForTax: t.valueForTax,
                  ratePercentage: t.ratePercentage,
                  amount: t.amount,
                })) || [],
              additionalInformation:
                r.additionalInformation?.map(a => ({
                  type: a.type._id,
                  value: a.value,
                })) || [],
            })) || [],
        });
      } else {
        this.formService.reset();
      }
    });

    effect(() => {
      const shipping = this.shipping();

      if (shipping) {
        const allLines = shipping.invoices.flatMap(inv => inv.pdf.extractedData.lines);
        const merchandiseLines = allLines.filter(line => this.isMerchandiseLine(line));
        // const feeLines = allLines.filter(line => !this.isMerchandiseLine(line));
        const groupByTariff = this.groupByTariff(merchandiseLines);

        this.formService.patchValue({
          shippingId: shipping._id,
          directShipmentCountry: shipping.origin?._id,
          originalShipmentCountry: shipping.destination?._id,
          type: 'A',
          records: Object.entries(groupByTariff).map(([tariff, lines], i) => {
            const quantity = lines.reduce((acc, line) => acc + line.quantity, 0);
            const subtotal = lines.reduce((acc, line) => acc + line.subtotal, 0);

            return {
              number: i + 1,
              cpc: '4000',
              origin: lines[0]?.countryId?._id,
              tariff: tariff,
              description: lines[0]?.description,
              quantity: quantity,
              supplementaryCode: '0000',
              currency: lines[0]?.currency ?? 'USD',
              linesSubtotal: subtotal,
              exchangeRate: 1,
              charges: [],
              tax: [],
            };
          }),
        });
      }
    });
  }

  /**
   * Submits the BCD form.
   *
   * If the BCD is being updated, it will call the BCD service put method.
   * If the BCD is being created, it will call the BCD service post method.
   *
   * @param {FormValueState<bcdFormModel>} values - The form value state
   */
  async handleSubmit(values: FormValueState<bcdFormModel>) {
    const payload = values.rawValue;
    delete (payload as any).transport.type;

    if (!payload.charges || payload.charges.length === 0) {
      this.toastManager.showError('Charges are required');
      return;
    }

    if (payload.records?.some(r => !r?.charges || r?.charges?.length === 0)) {
      this.toastManager.showError('Charges are required for each record');
      return;
    }

    if (!payload.containerIds || payload.containerIds.length === 0) {
      this.toastManager.showError('Container IDs are required');
      return;
    }

    if (!payload.records || payload.records.length === 0) {
      this.toastManager.showError('Records are required');
      return;
    }

    this.isSubmitLoading.set(true);

    const action = this.isUpdate()
      ? this.crudBCD.put({ _id: this.id(), data: payload })
      : this.crudBCD.post({ data: payload });

    action.pipe(takeUntilDestroyed(this.destroy$)).subscribe({
      next: () => {
        this.isSubmitLoading.set(false);
        this.formService.reset();
        this.goBack();
      },
      error: () => {
        this.isSubmitLoading.set(false);
      },
    });
  }

  /**
   * Uploads the current BCD data to FTP
   * @returns {void}
   * @memberof BcdsFormComponent
   */
  uploadFtp() {
    this.isFtpSubmitLoading.set(true);

    this.crudBCD
      .uploadBCDDataToFTP(this.id())
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: () => {
          this.isFtpSubmitLoading.set(false);
          this.formService.reset();
          this.goBack();
        },
        error: () => {
          this.isFtpSubmitLoading.set(false);
        },
      });
  }

  /**
   * Downloads the SENT_CSV file from FTP
   * @returns {void}
   * @memberof BcdsFormComponent
   */
  downloadFtp() {
    const fileId = this.bcd()?.ebcds.find(ebcd => ebcd.type === 'SENT_CSV')?.file.fileId;

    if (!fileId) return;

    this.fileResolver.downloadFileInBrowser({ id: fileId });
  }

  // --------- UTILS ----------

  /**
   * Checks if a line is a merchandise line.
   *
   * A line is considered a merchandise line if it has a valid HS Code and a valid Tariff Code.
   *
   * @param line - The line to be checked.
   * @returns True if the line is a merchandise line, false otherwise.
   */
  isMerchandiseLine(line: invoicePDF['extractedData']['lines'][number]) {
    return Boolean(line.hsCode && line.tariff?.code);
  }

  /**
   * Groups the given lines by their tariff code.
   *
   * If a line does not have a tariff code, it will not be included in the result.
   *
   * @param lines - The lines to group by tariff code.
   * @returns An object where the keys are the tariff codes and the values are arrays of lines that have the corresponding tariff code.
   */
  groupByTariff(lines: invoicePDF['extractedData']['lines']) {
    return lines.reduce<Record<string, invoicePDF['extractedData']['lines']>>((acc, line) => {
      const tariff = line.tariff!.code!;
      acc[tariff] ??= [];
      acc[tariff].push(line);
      return acc;
    }, {});
  }

  /**
   * Navigate back to the list of BCDs.
   *
   * This function navigates back to the list of BCDs when the back button is clicked.
   */
  goBack() {
    this.router.navigate(['../../../list'], { relativeTo: this.route });
  }
}
