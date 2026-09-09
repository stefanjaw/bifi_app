export interface lineItem {
  productId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  /** Quantity received into stock via the receive endpoint */
  receivedQuantity?: number;
  taxIds?: string[];
  discountId?: string;
}
