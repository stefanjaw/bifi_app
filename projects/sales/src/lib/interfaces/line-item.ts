import { product } from '@avalantec/inventory';

export interface lineItem {
  productId?: string | product;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}
