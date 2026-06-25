import { inject, Injectable } from '@angular/core';
import { ShippingForm } from './shipping-form';
import { CrudShippings } from './crud-shippings';
import { shipping } from '../interfaces/shipping';

@Injectable({ providedIn: 'root' })
export class InvoiceLinesHSCode {
  private crudShippings = inject(CrudShippings);
  private form = inject(ShippingForm);

  private applyHSCodesToForm(shipping: shipping) {
    shipping.invoices.forEach((invoice, invoiceIndex) => {
      const formLines =
        this.form.form.controls.invoices.at(invoiceIndex).controls.extractedData.controls.lines;

      invoice.pdf.extractedData.lines.forEach((line, lineIndex) => {
        const formLine = formLines.at(lineIndex);
        if (!formLine) return;

        formLine.patchValue({
          hsCode: line.hsCode,
          customsChapter: line.customsChapter,
          customsHeading: line.customsHeading,
          customsSubheading: line.customsSubheading,
          chapterDescription: line.chapterDescription,
          headingDescription: line.headingDescription,
          subheadingDescription: line.subheadingDescription,
          tariff: {
            code: line.tariff?.code,
            chapter: line.tariff?.chapter,
            heading: line.tariff?.heading,
            subheading: line.tariff?.subheading,
            description: line.tariff?.description,
            rateOfDuty: line.tariff?.rateOfDuty,
          },
        });
      });
    });
  }
}
