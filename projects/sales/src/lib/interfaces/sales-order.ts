import { contact, company, user } from '@avalantec/base-app/interfaces';
import { crm } from '@avalantec/crm';

export interface salesOrder {
  _id: string;
  crmId?: crm;
  contact?: contact;
  company?: company;
  salesperson?: user;
  amount: number;
  currency: string;
  closeDate: string;
  notes?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
