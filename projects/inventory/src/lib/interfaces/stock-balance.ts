import { product } from './product';
import { location } from './location';
import { warehouse } from './warehouse';

export interface stockBalance {
  _id: string;
  productId?: product;
  locationId?: location;
  warehouseId?: warehouse;
  quantity: number;
  createdAt?: string;
  updatedAt?: string;
}
