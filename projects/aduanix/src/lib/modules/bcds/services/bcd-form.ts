import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';
import { Validators } from '@angular/forms';
import { bcdFormModel } from '../interfaces/bcd-form';

@Injectable({
  providedIn: 'root',
})
export class BcdForm extends BaseForm<bcdFormModel> {
  // Implementation of the BcdForm service would go here
  override createForm() {
    return this.fb.group<bcdFormModel>({
      shippingId: ['', [Validators.required]],
      type: ['', [Validators.required]],
      supplier: {
        contactId: ['', [Validators.required]],
      },
      importer: {
        contactId: ['', [Validators.required]],
      },
      transport: {
        type: ['aircraft', [Validators.required]],
        aircraftOrVessel: ['', [Validators.required]],
        flightOrVoyage: ['', [Validators.required, Validators.maxLength(255)]],
        port: ['', [Validators.required]],
        arrivalDate: [new Date(), [Validators.required]],
      },
      manifest: ['', [Validators.required, Validators.maxLength(255)]],
      masterBOLAWB: ['', [Validators.required, Validators.maxLength(255)]],
      houseBOLAWB: {
        template: [''],
        formArrayElements: [],
      },
      directShipmentCountry: ['', [Validators.required]],
      originalShipmentCountry: ['', [Validators.required]],
      warehouseId: ['', [Validators.minLength(4), Validators.maxLength(4)]],
      charges: {
        template: {
          code: ['212', [Validators.required]],
          percentage: [0, [Validators.min(0), Validators.max(100)]],
          amount: [0, [Validators.required, Validators.min(0)]],
        },
        formArrayElements: [],
      },
      containerIds: {
        template: [''],
        formArrayElements: [],
      },
      valuationMethod: [
        '01',
        [Validators.required, Validators.minLength(2), Validators.maxLength(2)],
      ],
      packagesCount: [0, [Validators.required, Validators.min(0)]],
      recordsCount: [0, [Validators.required, Validators.min(0)]],
      invoiceAmount: [0, [Validators.required, Validators.min(0)]],
      payableAmount: [0, [Validators.required, Validators.min(0)]],
      additionalInformation: {
        template: {
          type: ['', [Validators.required]],
          value: ['', [Validators.required, Validators.maxLength(70)]],
        },
        formArrayElements: [],
      },
      ogd: {
        paymentCode: ['', [Validators.maxLength(255)]],
        costCode: ['', [Validators.required]],
        objectCode: ['', [Validators.required]],
        subsidiaryCode: ['', [Validators.required]],
        explanation: [''],
      },
      paymentAccounts: {
        template: [''],
        formArrayElements: [],
      },
      declarant: {
        name: ['', [Validators.required, Validators.maxLength(255)]],
        companyId: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]],
        date: [new Date(), [Validators.required]],
        capacity: ['', [Validators.required]],
        traderReference: ['', [Validators.required]],
      },
      records: {
        template: {
          // Add fields for records here
          number: [0, [Validators.required, Validators.min(0)]],
          cpc: ['', [Validators.required]],
          origin: ['', [Validators.required]],
          tariff: ['', [Validators.required]],
          description: ['', [Validators.required, Validators.maxLength(200)]],
          quantity: [0, [Validators.required, Validators.min(0)]],
          quantityTwo: [0, [Validators.min(0)]],
          supplementaryCode: ['', [Validators.required, Validators.maxLength(10)]],
          currency: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
          linesSubtotal: [0, [Validators.required, Validators.min(0)]],
          exchangeRate: [0, [Validators.required, Validators.min(0)]],
          bdaValue: [0, [Validators.required, Validators.min(0)]],
          totalDue: [0, [Validators.required, Validators.min(0)]],
          charges: {
            template: {
              code: ['212', [Validators.required]],
              percentage: [0, [Validators.min(0), Validators.max(100)]],
              amount: [0, [Validators.required, Validators.min(0)]],
            },
            formArrayElements: [],
          },
          tax: {
            template: {
              type: ['CUD', [Validators.required]],
              taxId: ['F', [Validators.required]],
              valueForTax: [0, [Validators.required, Validators.min(0)]],
              ratePercentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
              amount: [0, [Validators.required, Validators.min(0)]],
            },
            formArrayElements: [],
          },
          additionalInformation: {
            template: {
              type: ['', [Validators.required]],
              value: ['', [Validators.required, Validators.maxLength(70)]],
            },
            formArrayElements: [],
          },
        },
        formArrayElements: [],
      },
    });
  }
}
