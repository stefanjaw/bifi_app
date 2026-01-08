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
import { ReactiveFormsModule } from '@angular/forms';
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

      if (shipping) {
        this.formService.patchValue({
          name: shipping.name,
          origin: shipping.origin._id,
          destination: shipping.destination._id,
          invoices: shipping.invoices.map(invoice => ({
            extractedData: {
              header: {
                invoiceNumber: invoice.pdf.extractedData?.header?.invoiceNumber,
                date: invoice.pdf.extractedData?.header?.date,
                countryId: invoice.pdf.extractedData?.header?.countryId?._id,
                companyId: invoice.pdf.extractedData?.header?.companyId?._id,
                address: invoice.pdf.extractedData?.header?.address,
                phone: invoice.pdf.extractedData?.header?.phone,
                email: invoice.pdf.extractedData?.header?.email,
                total: invoice.pdf.extractedData?.header?.total,
                currency: invoice.pdf.extractedData?.header?.currency,
              },
              lines: invoice.pdf.extractedData?.lines?.map(line => ({
                checked: false,
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
              })),
            },
          })),
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
      .controls.extractedData.controls.lines.controls.filter(line => line.controls.checked.value);

    // If there are no selected lines, we return
    if (selectedLines.length === 0) {
      return;
    }

    // We call the CRUD service to generate the HS codes for the selected lines
    this.crudShippings
      .generateHSCodesForShipping(
        selectedLines.map(line => {
          const rawValue = line.getRawValue();
          delete rawValue.checked;
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
              },
            });

            selectedLines.forEach(line => {
              line.controls.checked.setValue(false);
            });
          });
        },
      });

    // Here we would call a service to get the HS codes for the selected lines
    // For demonstration purposes, we'll just log the selected lines
    console.log('Generating HS Codes for lines:', selectedLines);

    // After getting the HS codes, we would patch the form with the new data
    // For now, we'll just uncheck the lines to simulate that they have been processed
  }

  /**
   * Selects or deselects all lines of the specified invoice.
   * @param invoiceIndex - The index of the invoice to select or deselect lines from
   * @param checked - Whether to select or deselect the lines
   */
  selectAllLines(invoiceIndex: number, checked: boolean) {
    this.form.controls.invoices
      .at(invoiceIndex)
      .controls.extractedData.controls.lines.controls.forEach(line =>
        line.controls.checked.setValue(checked)
      );
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
