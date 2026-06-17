export interface lineItem {
  productId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  taxIds?: string[];
  discountId?: string;
}
