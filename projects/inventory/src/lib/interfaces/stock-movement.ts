import { product } from './product';
import { location } from './location';
import { warehouse } from './warehouse';

export type movementType = 'IN' | 'OUT' | 'ADJUSTMENT' | 'TRANSFER';

export interface stockMovement {
  _id: string;
  productId?: product;
  warehouseId?: warehouse;
  locationId?: location;
  quantity: number;
  type: movementType;
  reference?: string;
  notes?: string;
  date?: string;
  createdAt?: string;
}
