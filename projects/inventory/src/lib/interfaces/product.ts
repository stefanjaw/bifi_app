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
  photo?: string;
  attachments?: { fileId: string; name: string; mimeType: string; size: number }[];
  createdAt?: string;
  updatedAt?: string;
}
