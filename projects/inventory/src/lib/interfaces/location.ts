import { warehouse } from './warehouse';

export interface location {
  _id: string;
  name: string;
  code: string;
  warehouseId?: warehouse;
  capacity?: number;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
