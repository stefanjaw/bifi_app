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
        flightOrVoyage: ['', [Validators.required, Validators.maxLength(10)]],
        port: ['', [Validators.required]],
        arrivalDate: [new Date(), [Validators.required]],
      },
      manifest: ['', [Validators.required, Validators.maxLength(20)]],
      masterBOLAWB: ['', [Validators.required, Validators.maxLength(20)]],
      houseBOLAWBs: {
        template: ['', [Validators.required, Validators.maxLength(20)]],
        formArrayElements: [],
      },
      directShipmentCountry: ['', [Validators.required]],
      originalShipmentCountry: ['', [Validators.required]],
      warehouseId: ['', [Validators.minLength(4), Validators.maxLength(4)]],
      charges: {
        template: {
          code: [''],
          percentage: [0, [Validators.min(0), Validators.max(100)]],
          amount: [0, [Validators.required, Validators.min(0)]],
        },
        formArrayElements: [],
      },
      containerIds: {
        template: ['', [Validators.required, Validators.maxLength(20)]],
        formArrayElements: [],
      },
      valuationMethod: [
        '01',
        [Validators.required, Validators.minLength(2), Validators.maxLength(3)],
      ],
      packagesCount: [0, [Validators.required, Validators.min(0)]],
      recordsCount: [0, [Validators.required, Validators.min(0)]],
      invoiceAmount: [0, [Validators.required, Validators.min(0)]],
      payableAmount: [0, [Validators.required, Validators.min(0)]],
      additionalInformation: {
        template: {
          type: [''],
          value: ['', [Validators.required, Validators.maxLength(70)]],
        },
        formArrayElements: [],
      },
      ogd: {
        paymentCode: ['', [Validators.maxLength(3)]],
        costCode: ['', [Validators.minLength(5), Validators.maxLength(5)]],
        objectCode: ['', [Validators.minLength(4), Validators.maxLength(4)]],
        subsidiaryCode: ['', [Validators.minLength(5), Validators.maxLength(5)]],
        explanation: ['', [Validators.maxLength(30)]],
      },
      paymentAccounts: {
        template: ['', [Validators.required, Validators.maxLength(20)]],
        formArrayElements: [],
      },
      declarant: {
        name: ['', [Validators.required, Validators.maxLength(30)]],
        companyId: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
        date: [new Date(), [Validators.required]],
        capacity: ['', [Validators.required, Validators.maxLength(20)]],
        traderReference: ['', [Validators.required, Validators.maxLength(40)]],
      },
      records: {
        template: {
          // Add fields for records here
          number: [0, [Validators.required, Validators.min(0)]],
          cpc: ['', [Validators.required]],
          origin: ['', [Validators.required]],
          tariff: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(7)]],
          description: ['', [Validators.required, Validators.maxLength(200)]],
          quantity: [0, [Validators.required, Validators.min(0)]],
          quantityTwo: [0, [Validators.min(0)]],
          supplementaryCode: ['', [Validators.maxLength(10)]],
          currency: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
          linesSubtotal: [0, [Validators.required, Validators.min(0)]],
          exchangeRate: [0, [Validators.required, Validators.min(0)]],
          bdaValue: [0, [Validators.required, Validators.min(0)]],
          totalDue: [0, [Validators.required, Validators.min(0)]],
          charges: {
            template: {
              code: ['', [Validators.required]],
              percentage: [0, [Validators.min(0), Validators.max(100)]],
              amount: [0, [Validators.required, Validators.min(0)]],
            },
            formArrayElements: [],
          },
          tax: {
            template: {
              type: ['', [Validators.required]],
              taxId: ['', [Validators.required]],
              valueForTax: [0, [Validators.required, Validators.min(0)]],
              ratePercentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
              amount: [0, [Validators.required, Validators.min(0)]],
            },
            formArrayElements: [],
          },
          additionalInformation: {
            template: {
              type: [''],
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
