import { product } from './product';
import { location } from './location';
import { warehouse } from './warehouse';

export type movementType = 'IN' | 'OUT' | 'ADJUSTMENT' | 'TRANSFER';

export type adjustmentDirection = 'INCREASE' | 'DECREASE';

export interface stockMovement {
  _id: string;
  productId?: product;
  warehouseId?: warehouse;
  locationId?: location;
  quantity: number;
  type: movementType;
  /** Unit cost at transaction time (weighted average for OUT/TRANSFER, product cost or override for IN) */
  unitCost?: number;
  /** Total cost of the movement (unitCost × quantity), computed server-side */
  totalCost?: number;
  /** Direction for ADJUSTMENT movements (INCREASE adds stock, DECREASE removes stock) */
  adjustmentDirection?: adjustmentDirection;
  reference?: string;
  /** Classification of the external reference (e.g. purchase-order, transfer-out/transfer-in) */
  referenceType?: string;
  /** Original movement reversed by this movement */
  reversalOf?: string | stockMovement;
  notes?: string;
  date?: string;
  createdAt?: string;
}
