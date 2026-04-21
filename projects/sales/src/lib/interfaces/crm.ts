import { contact } from '@avalantec/base-app/interfaces';
import { company } from '@avalantec/base-app/interfaces';
import { user } from '@avalantec/base-app/interfaces';
import { crmStage } from '../modules/crm-stages';
import { currency } from '@avalantec/base-app/currency';

export interface crm {
  _id: string;
  title: string;
  amount: number;
  currency: currency;
  stage?: crmStage;
  probability: number;
  expectedCloseDate?: Date;
  actualCloseDate?: string;
  contact?: contact;
  company?: company;
  owner?: user;
  salesperson?: user;
  tags?: string[];
  description?: string;
  notes?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
