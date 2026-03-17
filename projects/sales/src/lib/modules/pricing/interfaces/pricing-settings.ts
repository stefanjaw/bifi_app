import { sequence } from '@avalantec/base-app/sequences';

export interface PricingFolder {
  _id?: string;
  type: 'pricing' | 'freight' | 'config';
  folderId: string;
  label?: string;
}

export interface pricingSettings {
  _id?: string;
  estimateSequence?: sequence | string;
  defaultWharfageBankFeePct?: number;
  defaultShippingMethod?: string;
  defaultPricingMethod?: string;
  defaultMarkupFactor?: number;
  defaultMargin?: number;
  folders?: PricingFolder[];
  catalogLastIndexed?: string;
  freightLastIndexed?: string;
}

export interface IndexingStatus {
  catalogRecords: number;
  freightRecords: number;
  catalogLastIndexed: string | null;
  freightLastIndexed: string | null;
  scheduledJobActive: boolean;
  isRunning: boolean;
  lastResult: IndexingSummary | null;
}

export interface IndexingSummary {
  filesProcessed: number;
  catalogRecords: number;
  freightRecords: number;
  suppliersFound: string[];
  freightTypesFound: string[];
  lastIndexedAt: string;
  errors: string[];
}
