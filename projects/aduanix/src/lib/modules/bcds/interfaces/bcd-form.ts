import {
  AdditionalInformationType,
  BCDType,
  ChargeCodeType,
  TaxIdType,
  TaxType,
  TransportMethodType,
  ValuationMethodType,
} from './bcd-types';

export interface bcdFormSupplierModel {
  contactId: string;
}

export interface bcdFormImporterModel {
  contactId: string;
}

export interface bcdFormTransportModel {
  type: TransportMethodType;
  aircraftOrVessel: string;
  flightOrVoyage: string;
  port: string;
  arrivalDate: Date;
}

export interface bcdFormChargeModel {
  code: ChargeCodeType;
  percentage?: number;
  amount: number;
}

export interface bcdFormDeclarantModel {
  name: string;
  companyId: string;
  date: Date;
  capacity: string;
  traderReference: string;
}

export interface bcdFormTaxEntryModel {
  type: TaxType;
  taxId: TaxIdType;
  valueForTax: number;
  ratePercentage: number;
  amount: number;
}

export interface bcdFormAdditionalInformationModel {
  type: AdditionalInformationType;
  value: string;
}

export interface bcdFormRecordModel {
  number: number;
  cpc: string;
  origin: string;
  tariff: string;
  description: string;
  quantity: number;
  quantityTwo?: number;
  supplementaryCode: string;
  currency: string;
  linesSubtotal: number;
  exchangeRate: number;
  charges: bcdFormChargeModel[]; // Array of objects
  tax?: bcdFormTaxEntryModel[]; // Array of objects
  additionalInformation?: bcdFormAdditionalInformationModel[]; // Array of objects
}

export interface bcdFormOGDModel {
  paymentCode?: string;
  costCode: string;
  objectCode: string;
  subsidiaryCode: string;
  explanation?: string;
}

export interface bcdFormModel {
  shippingId: string;
  type: BCDType;
  supplier: bcdFormSupplierModel;
  importer: bcdFormImporterModel;
  transport: bcdFormTransportModel;
  manifest: string;
  masterBOLAWB: string;
  houseBOLAWB?: string[]; // Array of strings
  directShipmentCountry: string;
  originalShipmentCountry: string;
  warehouseId?: string;
  charges: bcdFormChargeModel[]; // Array of objects
  containerIds: string[];
  valuationMethod: ValuationMethodType;
  packagesCount: number;
  additionalInformation: bcdFormAdditionalInformationModel[]; // Array of objects
  ogd: bcdFormOGDModel;
  paymentAccounts: string[]; // Array of strings
  declarant: bcdFormDeclarantModel;
  records: bcdFormRecordModel[]; // Array of objects
}
