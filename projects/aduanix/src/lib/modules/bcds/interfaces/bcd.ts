import { contact, country } from '@avalantec/base-app/interfaces';
import {
  AdditionalInformationType,
  BCDStatusType,
  BCDType,
  ChargeCodeType,
  EBCDType,
  TaxIdType,
  TaxType,
  ValuationMethodType,
} from './bcd-types';
import { file } from '@avalantec/base-app/resource';
import { shipping } from '../../shippings';

export interface bcdSupplier {
  contactId: contact;
}

export interface bcdImporter {
  contactId: contact;
}

export interface bcdTransport {
  aircraftOrVessel: string;
  flightOrVoyage: string;
  port: string;
  arrivalDate: string;
}

export interface bcdCharge {
  code: ChargeCodeType;
  percentage?: number;
  amount: number;
}

export interface bcdDeclarant {
  name: string;
  companyId: string;
  date: string;
  capacity: string;
  traderReference: string;
}

export interface bcdTaxEntry {
  type: TaxType;
  taxId: TaxIdType;
  valueForTax: number;
  ratePercentage: number;
  amount: number;
}

export interface bcdAdditionalInformation {
  type: AdditionalInformationType;
  value: string;
}

export interface bcdRecord {
  number: number;
  cpc: string;
  origin: country;
  tariff: string;
  description: string;
  quantity: number;
  quantityTwo?: number;
  supplementaryCode: string;
  currency: string;
  linesSubtotal: number;
  exchangeRate: number;
  bdaValue: number;
  totalDue: number;
  charges: bcdCharge[];
  tax?: bcdTaxEntry[];
  additionalInformation?: bcdAdditionalInformation[];
}

export interface bcdOgd {
  paymentCode?: string;
  costCode: string;
  objectCode: string;
  subsidiaryCode: string;
  explanation?: string;
}

export interface ebcdSchema {
  file: file;
  type: EBCDType;
}

export interface bcd {
  shippingId: shipping;
  status: BCDStatusType;
  type: BCDType;
  supplier: bcdSupplier;
  importer: bcdImporter;
  transport: bcdTransport;
  manifest: string;
  masterBOLAWB: string;
  houseBOLAWB?: string[];
  directShipmentCountry: country;
  originalShipmentCountry: country;
  warehouseId?: string;
  charges: bcdCharge[];
  containerIds: string[];
  valuationMethod: ValuationMethodType;
  packagesCount: number;
  invoiceAmount: number;
  payableAmount: number;
  additionalInformation: bcdAdditionalInformation[];
  ogd: bcdOgd;
  paymentAccounts?: string[];
  declarant: bcdDeclarant;
  records: bcdRecord[];
  ebcds: ebcdSchema[];
}
