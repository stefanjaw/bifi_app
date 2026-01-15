import { company, contact } from '@avalantec/base-app/interfaces';

export interface bcdSupplier {
  contactId: contact;
}

export interface bcdImporter {
  contactId: contact;
}

export interface bcdTransport {
  type: 'AIRLINE' | 'VESSEL';
  aircraftOrVessel: string;
  flightOrVoyage: string;
  port: string;
  arrivalDate: string;
}

export interface bcdCharge {
  code: 'CASH_DISCOUNT' | 'FREIGHT_ADDITIONAL' | 'FRIEGHT_STAT';
  percentage?: number;
  amount: number;
}

export interface bcdDeclarant {
  name: string;
  companyId: company;
  date: Date;
  capacity: string;
  traderReference: string;
}

export interface bcdTaxEntry {
  type: 'CUD' | 'WHA' | 'WSF';
  taxId: 'F' | 'E';
  valueForTax: number;
  ratePercentage: number;
  amount: number;
}

export interface bcdAdditionalInformation {
  type: 'TXT' | 'INV' | 'SUP';
  value: string;
}

export interface bcdRecord {
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
  charges: bcdCharge[];
  tax: bcdTaxEntry[];
  additionalInformation: bcdAdditionalInformation[];
}

export interface bcdOgd {
  paymentCode: string;
  costCode: string;
  objectCode: string;
  subsidiaryCode: string;
  explanation: string;
}

export interface bcd {
  supplier: bcdSupplier;
  importer: bcdImporter;
  transport: bcdTransport;
  manifest: string;
  masterBOLAWB: string;
  houseBOLAWB: string;
  directShipmentCountry: string;
  originalShipmentCountry: string;
  warehouseId?: string;
  charges: bcdCharge[];
  containersIds: string[];
  valuationMethod: '01' | '02';
  packagesCount: number;
  additionalInformation: bcdAdditionalInformation[];
  ogd: bcdOgd;
  paymentAccounts: string[];
  declarant: bcdDeclarant;
  records: bcdRecord[];
}
