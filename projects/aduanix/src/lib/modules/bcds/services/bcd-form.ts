import { company, contact } from '@avalantec/base-app/interfaces';
import {
  AdditionalInformationTypeEnum,
  TaxIdTypeEnum,
  TaxTypeEnum,
  TransportMethodTypeEnum,
  ValuationMethodTypeEnum,
} from '../interfaces/bcd-types';
import { Injectable } from '@angular/core';
import { BaseForm } from '@avalantec/base-app/form';
import { Validators } from '@angular/forms';

export interface bcdModel {
  supplier: {
    contactId: string;
  };
  importer: {
    contactId: string;
  };
  transport: {
    type: string;
    aircraftOrVessel: string;
    flightOrVoyage: string;
    port: string;
    arrivalDate: string;
  };
  manifest: string;
  masterBOLAWB: string;
  houseBOLAWB: string[];
  directShipmentCountry: string;
  originalShipmentCountry: string;
  warehouseId?: string;
  charges: {
    code: string;
    percentage?: number;
    amount: number;
  }[];
  containersIds: string[];
  valuationMethod: string;
  packagesCount: number;
  additionalInformation: {
    type: string;
    value: string;
  }[];

  ogd: {
    paymentCode: string;
    costCode: string;
    objectCode: string;
    subsidiaryCode: string;
    explanation: string;
  };
  paymentAccounts: string[];
  declarant: {
    name: string;
    companyId: string;
    date: string;
    capacity: string;
    traderReference: string;
  };
  records:
    | {
        number: number;
        cpc: string;
        origin: string;
        tariff: string;
        description: string;
        quantity: number;
        quantityTwo: number;
        supplementaryCode: string;
        currency: string;
        linesSubtotal: number;
        exchangeRate: number;
        charges: {
          code: string;
          percentage?: number;
          amount: number;
        }[];
        tax: {
          type: string;
          taxId: string;
          valueForTax: number;
          ratePercentage: number;
          amount: number;
        }[];
        additionalInformation: {
          type: string;
          value: string;
        }[];
      }[]
    | null;
}

@Injectable({
  providedIn: 'root',
})
export class BcdForm extends BaseForm<bcdModel> {
  // Implementation of the BcdForm service would go here
  override createForm() {
    return this.fb.group<bcdModel>({
      supplier: {
        contactId: ['', Validators.required],
      },
      importer: {
        contactId: ['', Validators.required],
      },
      transport: {
        type: ['', Validators.required],
        aircraftOrVessel: ['', Validators.required],
        flightOrVoyage: ['', Validators.required],
        port: ['', Validators.required],
        arrivalDate: ['', Validators.required],
      },
      manifest: ['', []],
      masterBOLAWB: ['', Validators.required],
      houseBOLAWB: {
        template: [''],
        formArrayElements: [],
      },
      directShipmentCountry: ['', Validators.required],
      originalShipmentCountry: ['', Validators.required],
      warehouseId: ['', []],
      charges: {
        template: {
          code: ['', Validators.required],
          percentage: [0],
          amount: [0, Validators.required],
        },
        formArrayElements: [],
      },
      containersIds: {
        template: [''],
        formArrayElements: [],
      },
      valuationMethod: ['', []],
      packagesCount: [0, []],
      additionalInformation: {
        template: {
          type: ['', Validators.required],
          value: ['', Validators.required],
        },
        formArrayElements: [],
      },
      ogd: {
        paymentCode: [''],
        costCode: [''],
        objectCode: [''],
        subsidiaryCode: [''],
        explanation: [''],
      },
      paymentAccounts: {
        template: [''],
        formArrayElements: [],
      },
      declarant: {
        name: ['', Validators.required],
        companyId: ['', Validators.required],
        date: ['', Validators.required],
        capacity: ['', Validators.required],
        traderReference: ['', Validators.required],
      },

      records: {
        template: {
          // Add fields for records here
          number: [0, Validators.required],
          cpc: ['', Validators.required],
          origin: ['', Validators.required],
          tariff: ['', Validators.required],
          description: ['', Validators.required],
          quantity: [0, Validators.required],
          quantityTwo: [0, Validators.required],
          supplementaryCode: ['', Validators.required],
          currency: ['', Validators.required],
          linesSubtotal: [0, Validators.required],
          exchangeRate: [0, Validators.required],
          charges: {
            template: {
              code: ['', Validators.required],
              percentage: [0],
              amount: [0, Validators.required],
            },
            formArrayElements: [],
          },
          tax: {
            template: {
              type: ['', Validators.required],
              taxId: ['', Validators.required],
              valueForTax: [0, Validators.required],
              ratePercentage: [0, Validators.required],
              amount: [0, Validators.required],
            },
            formArrayElements: [],
          },
          additionalInformation: {
            template: {
              type: ['', Validators.required],
              value: ['', Validators.required],
            },
            formArrayElements: [],
          },
        },
        formArrayElements: [],
      },
    });
  }
}
