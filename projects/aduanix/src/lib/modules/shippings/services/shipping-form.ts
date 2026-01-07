import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm, GroupReturn } from '@avalantec/base-app/form';

export interface ShippingInvoiceLineFormModel {
  checked?: boolean;
  lineNumber: string;
  countryId: string;
  currency: string;
  description: string;
  quantity: number;
  price: number;
  subtotal: number;
  customsClassification: string;
  hsCode?: string;
  customsChapter?: string;
  customsHeading?: string;
  customsSubheading?: string;
  chapterDescription?: string;
  headingDescription?: string;
  subheadingDescription?: string;
  tariff: {
    code?: string;
    chapter: string;
    heading: string;
    subheading: string;
    userDescription?: string;
    description?: string;
    rateOfDuty?: number;
  };
}

export interface ShippingFormModel {
  name: string;
  origin: string;
  destination: string;
  invoices: {
    extractedData: {
      header: {
        invoiceNumber: string;
        date: string;
        countryId: string;
        companyId: string;
        address: string;
        phone: string;
        email: string;
        total: number;
        currency: string;
      };
      lines: ShippingInvoiceLineFormModel[];
    };
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class ShippingForm extends BaseForm<ShippingFormModel> {
  override createForm() {
    return this.fb.group<ShippingFormModel>({
      name: ['', Validators.required],
      origin: ['', Validators.required],
      destination: ['', Validators.required],
      invoices: {
        template: {
          extractedData: {
            header: {
              invoiceNumber: ['', Validators.required],
              date: ['', Validators.required],
              countryId: ['', Validators.required],
              companyId: ['', Validators.required],
              address: ['', Validators.required],
              phone: ['', Validators.required],
              email: ['', Validators.required],
              total: [0, Validators.required],
              currency: ['', Validators.required],
            },
            lines: {
              template: {
                checked: [false],
                lineNumber: ['', Validators.required],
                countryId: ['', Validators.required],
                currency: ['', Validators.required],
                description: ['', Validators.required],
                quantity: [0, Validators.required],
                price: [0, Validators.required],
                subtotal: [0, Validators.required],
                customsClassification: ['', Validators.required],
                hsCode: [''],
                customsChapter: [''],
                customsHeading: [''],
                customsSubheading: [''],
                chapterDescription: [''],
                headingDescription: [''],
                subheadingDescription: [''],
                tariff: {
                  code: [''],
                  chapter: [''],
                  heading: [''],
                  subheading: [''],
                  userDescription: [''],
                  description: [''],
                  rateOfDuty: [0],
                },
              },
              formArrayElements: [],
            },
          },
        },
        formArrayElements: [],
      },
    });
  }

  /**
   * Creates a form group for an invoice line.
   *
   * The form group contains the following fields:
   * - lineNumber: The line number of the invoice line.
   * - countryId: The country ID of the invoice line.
   * - currency: The currency of the invoice line.
   * - description: The description of the invoice line.
   * - quantity: The quantity of the invoice line.
   * - price: The price of the invoice line.
   * - subtotal: The subtotal of the invoice line.
   * - customsClassification: The customs classification of the invoice line.
   * - hsCode: The HS code of the invoice line.
   * - customsChapter: The customs chapter of the invoice line.
   * - customsHeading: The customs heading of the invoice line.
   * - customsSubheading: The customs subheading of the invoice line.
   * - chapterDescription: The chapter description of the invoice line.
   * - headingDescription: The heading description of the invoice line.
   * - subheadingDescription: The subheading description of the invoice line.
   * - tariff: The tariff details of the invoice line.
   *   - code: The tariff code of the invoice line.
   *   - chapter: The tariff chapter of the invoice line.
   *   - heading: The tariff heading of the invoice line.
   *   - subheading: The tariff subheading of the invoice line.
   *   - userDescription: The user description of the tariff.
   *   - description: The description of the tariff.
   *   - rateOfDuty: The rate of duty of the tariff.
   *
   * @returns A form group for an invoice line.
   */
  createInvoiceLineForm() {
    return this.fb.group<ShippingInvoiceLineFormModel>({
      checked: [false],
      lineNumber: ['', Validators.required],
      countryId: ['', Validators.required],
      currency: ['', Validators.required],
      description: ['', Validators.required],
      quantity: [0, Validators.required],
      price: [0, Validators.required],
      subtotal: [0, Validators.required],
      customsClassification: ['', Validators.required],
      hsCode: [''],
      customsChapter: [''],
      customsHeading: [''],
      customsSubheading: [''],
      chapterDescription: [''],
      headingDescription: [''],
      subheadingDescription: [''],
      tariff: {
        code: [''],
        chapter: [''],
        heading: [''],
        subheading: [''],
        userDescription: [''],
        description: [''],
        rateOfDuty: [0],
      },
    });
  }

  /**
   * Add a new line to the shipping form at the specified invoice index
   * @param invoiceIndex the index of the invoice to add the line to
   */
  addLineToShipping(
    invoiceIndex: number,
    lineIndex: number,
    form: GroupReturn<ShippingInvoiceLineFormModel>
  ) {
    const lines =
      this.form.controls.invoices.at(invoiceIndex).controls.extractedData.controls.lines;

    if (lineIndex > -1) {
      lines.setControl(lineIndex, form);
      return;
    }

    lines.push(form);
  }

  removeLineFromShipping(invoiceIndex: number, lineIndex: number) {
    const lines =
      this.form.controls.invoices.at(invoiceIndex).controls.extractedData.controls.lines;
    lines.removeAt(lineIndex);
  }
}
