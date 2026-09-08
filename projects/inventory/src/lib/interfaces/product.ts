import { uom } from './uom';
import { productType } from './product-type';

export interface product {
  _id: string;
  name: string;
  sku: string;
  description?: string;
  unit?: string;
  unitOfMeasureId?: uom;
  productTypeId?: productType;
  barcode?: string;
  costPrice: number;
  /** Running weighted average cost used for inventory valuation */
  averageCost?: number;
  salePrice: number;
  defaultSaleTaxIds?: string[];
  defaultPurchaseTaxIds?: string[];
  active?: boolean;
  photo?: string;
  attachments?: { fileId: string; name: string; mimeType: string; size: number }[];
  createdAt?: string;
  updatedAt?: string;
}
