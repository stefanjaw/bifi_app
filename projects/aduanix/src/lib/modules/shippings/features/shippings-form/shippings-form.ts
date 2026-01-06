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
import { SelectModule } from 'primeng/select';
import { CrudShippings } from '../../services/crud-shippings';
import { CrudCountries } from '@avalantec/base-app/countries';
import { CrudCompanies } from '@avalantec/base-app/companies';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { InvoiceLinesFormDialog } from '../invoice-lines-form-dialog/invoice-lines-form-dialog';

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
  form = this.formService.form;

  // Comming in route as param
  id = input.required<string>();

  shippingsResource = this.crudShippings.get({
    id: this.id,
    triggerRequest: computed(() => this.id() !== undefined),
  });

  countriesResource = this.crudCountries.get({});
  companiesResource = this.crudCompanies.get({});

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
  
  error = this.shippingsResource.error;
  isSubmitLoading = signal<boolean>(false);

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

  removeLine(invoiceIndex: number, lineIndex: number) {
  this.formService.removeLineFromShipping(invoiceIndex, lineIndex);
}
  

  /*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Submits the form with the given values.
   * @param values - The form values.
   */
  /*******  a074237c-17c9-4bdd-8e0f-3298075a977e  *******/
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleSubmit(values: FormValueState<ShippingFormModel>) {
    this.isSubmitLoading.set(true);
    // const action = this.isUpdate()
    //   ? this.crudShippings.update({
    //       id: this.id(),
    //       data: values.data,
    //       triggerRequest: true,
    //     })
    //   : this.crudShippings.create({
    //       daa: values.data,
    //      triggerRequest: true,
    //     });
  }

  /**
   * Navigates back to the list of shippings.
   */
  goBack() {
    this.router.navigate(['../../list'], { relativeTo: this.route });
  }
}
