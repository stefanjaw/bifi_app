import { contact } from '@avalantec/base-app/interfaces';
import { lineItem } from './line-item';
import { purchaseStage } from '../modules/purchase-stages/interfaces/purchase-stage';

export type purchaseOrderStatus = 'draft' | 'sent' | 'partially_received' | 'received' | 'cancelled';

export interface purchaseOrder {
  _id: string;
  poNumber: string;
  contactId?: contact;
  status: purchaseOrderStatus;
  issueDate?: string;
  expectedDeliveryDate?: string;
  lineItems?: lineItem[];
  totalAmount?: number;
  notes?: string;
  stageId?: purchaseStage | null;
  createdAt?: string;
  updatedAt?: string;
}
