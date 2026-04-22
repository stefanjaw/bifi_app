import { contact, company, user } from '@avalantec/base-app/interfaces';
import { crm } from './crm';
import { lineItem } from './line-item';
import { salesOrderStage } from '../modules/sales-order-stages';

export interface salesOrder {
  _id: string;
  crmId?: crm;
  contact?: contact;
  company?: company;
  salesperson?: user;
  stageId?: salesOrderStage;
  amount: number;
  currency: string;
  closeDate: string;
  notes?: string;
  number?: string;
  lineItems?: lineItem[];
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
