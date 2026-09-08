/** Valuation report modes supported by the backend */
export type valuationMode = 'AS_OF' | 'DATE_RANGE';

/** Query parameters accepted by the inventory valuation report endpoint */
export interface valuationQuery {
  mode: valuationMode;
  asOfDate?: string;
  fromDate?: string;
  toDate?: string;
  warehouseId?: string;
  locationId?: string;
  productId?: string;
  productTypeId?: string;
}

/** Per-product valuation row of the report */
export interface valuationRow {
  productId: string;
  name: string;
  sku: string;
  quantity: number;
  unitCost: number;
  totalValue: number;
}

/** Point-in-time (AS_OF) valuation report */
export interface valuationAsOfReport {
  mode: 'AS_OF';
  asOfDate: string;
  rows: valuationRow[];
  totalValue: number;
}

/** Period (DATE_RANGE) valuation report */
export interface valuationDateRangeReport {
  mode: 'DATE_RANGE';
  fromDate: string;
  toDate: string;
  beginningValue: number;
  incomingValue: number;
  outgoingValue: number;
  adjustmentsValue: number;
  endingValue: number;
  rows: valuationRow[];
}

/** Valuation report payload returned by the valuation endpoint */
export type valuationReport = valuationAsOfReport | valuationDateRangeReport;
