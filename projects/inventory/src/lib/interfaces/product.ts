import { uom } from './uom';

export interface product {
  _id: string;
  name: string;
  sku: string;
  description?: string;
  unit?: string;
  unitOfMeasureId?: uom;
  costPrice: number;
  salePrice: number;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
