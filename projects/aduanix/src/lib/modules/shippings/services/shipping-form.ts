import { Injectable } from '@angular/core';
import { Validators } from '@angular/forms';
import { BaseForm } from '@avalantec/base-app/form';

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
      lines: {
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
      }[];
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
}
