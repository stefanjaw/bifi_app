export interface pricingEstimateLineItem {
  product: string;
  supplier: string;
  partNo: string;
  qty: number;
  unitPrice: number;
  freightPerUnit: number;
  hsCode: string;
  dutyPct: number;
  dutyPerUnit: number;
  wharfage: number;
  landedPerUnit: number;
  custPricePerUnit: number;
  marginPct: number;
  totalCust: number;
}

export interface pricingEstimate {
  _id?: string;
  number: string;
  date: string;
  preparedBy: string;
  requestText: string;
  shippingMethod: string;
  pricingControls: {
    dutyFree: boolean;
    method: string;
    markupFactor: number;
    margin: number;
  };
  specialInstructions: string;
  status: string;
  lineItems: pricingEstimateLineItem[];
  totalLanded: number;
  totalCustomer: number;
  wharfageBankFeePct: number;
  wharfageBankFeeAmount: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCost: number;
  aiProvider?: string;
  aiModel: string;
  active: boolean;
}

export interface tokenEstimation {
  catalogRowsToRetrieve: number;
  freightRowsToRetrieve: number;
  estimatedInputTokens: number;
  estimatedOutputTokens: number;
  totalEstimated: number;
  withinLimits: boolean;
}
