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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormModule, FormValueState } from '@avalantec/base-app/form';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressBarModule } from 'primeng/progressbar';
import { ShippingForm, ShippingFormModel } from '../../services/shipping-form';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SelectModule } from 'primeng/select';
import { CrudShippings } from '../../services/crud-shippings';
import { CrudCountries } from '@avalantec/base-app/countries';
import { CrudCompanies } from '@avalantec/base-app/companies';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { InvoiceLinesFormDialog } from '../invoice-lines-form-dialog/invoice-lines-form-dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { invoice } from '../../interfaces/shipping';

@Component({
  selector: 'bifi-app-shippings-form',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    FormModule,
    InputText,
    ButtonModule,
    ProgressBarModule,
    SelectModule,
    CardModule,
    TableModule,
    InvoiceLinesFormDialog,
    CheckboxModule,
  ],
  templateUrl: './shippings-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShippingsForm {
  private crudShippings = inject(CrudShippings);
  private crudCountries = inject(CrudCountries);
  private crudCompanies = inject(CrudCompanies);
  private formService = inject(ShippingForm);
  private destroy$ = inject(DestroyRef);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Comming in route as param
  id = input.required<string>();

  // Resources
  shippingsResource = this.crudShippings.get({
    id: this.id,
    triggerRequest: computed(() => this.id() !== undefined),
  });

  countriesResource = this.crudCountries.get({});
  companiesResource = this.crudCompanies.get({});

  form = this.formService.form;

  // Data
  shipping = this.shippingsResource.value;
  countries = this.countriesResource.value;
  companies = this.companiesResource.value;

  // view
  invoiceViewMode = signal<'hsCode' | 'tariff'>('hsCode');
  invoiceViewModeOptions = [
    { label: 'HS Code', value: 'hsCode' },
    { label: 'Tariff', value: 'tariff' },
  ];

  // State
  loading = computed(
    () =>
      this.shippingsResource.isLoading() ||
      this.countriesResource.isLoading() ||
      this.companiesResource.isLoading()
  );

  isUpdate = computed(() => !!this.shipping());
  error = this.shippingsResource.error;
  isSubmitLoading = signal<boolean>(false);

  // selections
  selected = signal<Record<number, boolean[]>>({});

  /**
   * Constructor
   *
   * It is called when the component is initialized.
   *
   * It resets the dirty state of the form and patches the form values with the shipping data if the shipping data is available.
   */
  constructor() {
    effect(() => {
      const shipping = this.shipping();

      this.formService.resetDirtyState();
      this.selected.set({});

      if (shipping) {
        this.formService.patchValue({
          name: shipping.name,
          origin: shipping.origin?._id,
          destination: shipping.destination?._id,
          invoices: shipping.invoices?.map((inv, i) => {
            const invoiceSelected: boolean[] = [];

            const invoice = {
              extractedData: {
                header: {
                  invoiceNumber: inv.pdf.extractedData?.header?.invoiceNumber,
                  date: inv.pdf.extractedData?.header?.date,
                  countryId: inv.pdf.extractedData?.header?.countryId?._id,
                  companyId: inv.pdf.extractedData?.header?.companyId?._id,
                  address: inv.pdf.extractedData?.header?.address,
                  phone: inv.pdf.extractedData?.header?.phone,
                  email: inv.pdf.extractedData?.header?.email,
                  total: inv.pdf.extractedData?.header?.total,
                  currency: inv.pdf.extractedData?.header?.currency,
                },
                lines: inv.pdf.extractedData?.lines?.map(line => {
                  invoiceSelected.push(false);

                  return {
                    lineNumber: line.lineNumber,
                    countryId: line.countryId?._id,
                    currency: line.currency,
                    description: line.description,
                    quantity: line.quantity,
                    price: line.price,
                    subtotal: line.subtotal,
                    customsClassification: line.customsClassification,
                    hsCode: line.hsCode,
                    customsChapter: line.customsChapter,
                    customsHeading: line.customsHeading,
                    customsSubheading: line.customsSubheading,
                    chapterDescription: line.chapterDescription,
                    headingDescription: line.headingDescription,
                    subheadingDescription: line.subheadingDescription,
                    tariff: line.tariff,
                  };
                }),
              },
            };

            const selectedLines = this.selected();
            selectedLines[i] = invoiceSelected;
            this.selected.set(selectedLines);

            return invoice;
          }),
        });
      }
    });
  }

  /**
   * Generate HS codes for the selected lines of the specified invoice.
   * @param index - The index of the invoice to generate HS codes for.
   */
  generateHSCodes(index: number) {
    // We get the selected lines from the form
    const selectedLines = this.form.controls.invoices
      .at(index)
      .controls.extractedData.controls.lines.controls.filter((_, j) => this.selected()[index][j]);

    // If there are no selected lines, we return
    if (selectedLines.length === 0) {
      return;
    }

    // We call the CRUD service to generate the HS codes for the selected lines
    this.crudShippings
      .generateHSCodesForShipping(
        selectedLines.map(line => {
          const rawValue = line.getRawValue();
          delete (rawValue as any).tariff;

          return rawValue as any;
        })
      )
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: lines => {
          if (!lines) return;

          lines.forEach((line, lineIndex) => {
            const formLine = selectedLines[lineIndex];

            if (!formLine || line.lineNumber !== formLine.getRawValue().lineNumber) return;

            formLine.patchValue({
              hsCode: line.hsCode || formLine.getRawValue().hsCode,
              customsChapter: line.customsChapter || formLine.getRawValue().customsChapter,
              customsHeading: line.customsHeading || formLine.getRawValue().customsHeading,
              customsSubheading: line.customsSubheading || formLine.getRawValue().customsSubheading,
              chapterDescription:
                line.chapterDescription || formLine.getRawValue().chapterDescription,
              headingDescription:
                line.headingDescription || formLine.getRawValue().headingDescription,
              subheadingDescription:
                line.subheadingDescription || formLine.getRawValue().subheadingDescription,
              tariff: {
                code: line.tariff?.code || formLine.getRawValue().tariff?.code,
                chapter: line.tariff?.chapter || formLine.getRawValue().tariff?.chapter,
                heading: line.tariff?.heading || formLine.getRawValue().tariff?.heading,
                subheading: line.tariff?.subheading || formLine.getRawValue().tariff?.subheading,
                description: line.tariff?.description || formLine.getRawValue().tariff?.description,
                rateOfDuty: line.tariff?.rateOfDuty || formLine.getRawValue().tariff?.rateOfDuty,
                userDescription:
                  line.tariff?.userDescription || formLine.getRawValue().tariff?.userDescription,
                unitOfMeasurement:
                  line.tariff?.unitOfMeasurement ||
                  formLine.getRawValue().tariff?.unitOfMeasurement,
                tax: line.tariff?.tax || formLine.getRawValue().tariff?.tax,
              },
            });
          });
        },
      })
      .add(() => this.selectAllLines(index, false));
  }

  /**
   * Generates tariff for the selected lines of the specified invoice.
   * @param index - The index of the invoice to generate tariff for
   */
  generateTariff(index: number) {
    const selectedLines = this.form.controls.invoices
      .at(index)
      .controls.extractedData.controls.lines.controls.filter((_, j) => this.selected()[index][j]);

    if (selectedLines.length === 0) {
      return;
    }

    /**
     * Calls the crud shippings service to generate tariff for the selected lines
     * @param lines - The lines to generate tariff for
     */
    this.crudShippings
      .generateTariffForShipping(
        selectedLines.map(line => {
          const rawValue = line.getRawValue();
          return rawValue as any;
        })
      )
      .pipe(takeUntilDestroyed(this.destroy$))
      .subscribe({
        next: lines => {
          if (!lines) return;

          /**
           * Patches the form with the generated tariff data
           * @param line - The line to patch
           * @param lineIndex - The index of the line to patch
           */
          lines.forEach((line, lineIndex) => {
            const formLine = selectedLines[lineIndex];

            if (!formLine || line.lineNumber !== formLine.getRawValue().lineNumber) return;

            formLine.patchValue({
              hsCode: line.hsCode || formLine.getRawValue().hsCode,
              customsChapter: line.customsChapter || formLine.getRawValue().customsChapter,
              customsHeading: line.customsHeading || formLine.getRawValue().customsHeading,
              customsSubheading: line.customsSubheading || formLine.getRawValue().customsSubheading,
              chapterDescription:
                line.chapterDescription || formLine.getRawValue().chapterDescription,
              headingDescription:
                line.headingDescription || formLine.getRawValue().headingDescription,
              subheadingDescription:
                line.subheadingDescription || formLine.getRawValue().subheadingDescription,
              tariff: {
                code: line.tariff?.code || formLine.getRawValue().tariff?.code,
                chapter: line.tariff?.chapter || formLine.getRawValue().tariff?.chapter,
                heading: line.tariff?.heading || formLine.getRawValue().tariff?.heading,
                subheading: line.tariff?.subheading || formLine.getRawValue().tariff?.subheading,
                description: line.tariff?.description || formLine.getRawValue().tariff?.description,
                rateOfDuty: line.tariff?.rateOfDuty || formLine.getRawValue().tariff?.rateOfDuty,
                userDescription:
                  line.tariff?.userDescription || formLine.getRawValue().tariff?.userDescription,
                unitOfMeasurement:
                  line.tariff?.unitOfMeasurement ||
                  formLine.getRawValue().tariff?.unitOfMeasurement,
                tax: line.tariff?.tax || formLine.getRawValue().tariff?.tax,
              },
            });
          });
        },
      })
      .add(() => this.selectAllLines(index, false));
  }

  /**
   * Sets all lines in the specified invoice to the specified checked state.
   * @param invoiceIndex the index of the invoice to set all lines for
   * @param checked the checked state to set all lines to
   */
  selectAllLines(invoiceIndex: number, checked: boolean) {
    this.selected.update(selected => {
      selected[invoiceIndex] = selected[invoiceIndex].map(() => checked);
      return selected;
    });
  }

  /**
   * Returns true if all lines in the specified invoice are selected, false otherwise.
   * @param invoiceIndex the index of the invoice to check
   * @returns true if all lines are selected, false otherwise
   */
  getInvoiceSelectionValue(invoiceIndex: number) {
    return this.selected()[invoiceIndex].every(Boolean);
  }

  /**
   * Removes a line from the shipping form at the specified invoice index.
   * @param invoiceIndex the index of the invoice to remove the line from
   * @param lineIndex the index of the line to remove
   */
  removeLine(invoiceIndex: number, lineIndex: number) {
    this.formService.removeLineFromShipping(invoiceIndex, lineIndex);
  }

  /**
   * Submits the shipping form.
   *
   * If the shipping is being updated, it will call the shippings service put method.
   * If the shipping is being created, it will call the shippings service post method.
   *
   * @param {FormValueState<ShippingFormModel>} data - The form value state
   */
  async handleSubmit(data: FormValueState<ShippingFormModel>) {
    const { rawValue } = data;

    const payload = structuredClone(rawValue);

    const invoices = payload.invoices.map<invoice>((invoice, i) => ({
      status: 'DATA_PROCESSED',
      pdf: {
        extractedData: {
          header: {
            ...(invoice.extractedData.header as any),
          },
          lines: invoice.extractedData.lines.map(line => {
            const lineCopy = structuredClone(line) as any;
            delete lineCopy.checked;
            return lineCopy;
          }),
        },
        file: this.shipping()?.invoices[i]?.pdf.file || undefined,
      },
    }));

    payload.invoices = invoices as any;

    const action = this.isUpdate()
      ? this.crudShippings.put({ _id: this.shipping()?._id || '', data: payload })
      : this.crudShippings.post({ data: payload });

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
   * Navigates back to the list of shippings.
   */
  goBack() {
    this.router.navigate(['../../list'], { relativeTo: this.route });
  }
}
