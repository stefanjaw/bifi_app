import { contact, company, user } from '@avalantec/base-app/interfaces';
import { currency } from '@avalantec/base-app/currency';
import { warehouse, location } from '@avalantec/inventory';
import { crm } from './crm';
import { lineItem } from './line-item';
import { salesOrderStage } from '../modules/sales-order-stages';

export type salesOrderStatus =
  | 'draft'
  | 'quote'
  | 'confirmed'
  | 'shipped'
  | 'completed'
  | 'cancelled';

export interface appliedTax {
  taxId: string;
  amount: number;
}

export interface salesOrder {
  _id: string;
  crmId?: crm;
  contact?: contact;
  company?: company;
  salesperson?: user;
  warehouseId?: warehouse;
  locationId?: location;
  stageId?: salesOrderStage;
  status?: salesOrderStatus;
  title?: string;
  amount: number;
  currency?: currency;
  closeDate: string;
  notes?: string;
  number?: string;
  lineItems?: lineItem[];
  subtotal?: number;
  taxes?: appliedTax[];
  taxTotal?: number;
  grandTotal?: number;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
