import { contact } from '@avalantec/base-app/interfaces';
import { company } from '@avalantec/base-app/interfaces';
import { user } from '@avalantec/base-app/interfaces';
import { crmStage } from '../modules/crm-stages';

export interface crm {
  _id: string;
  title: string;
  amount: number;
  currency: string;
  stage?: crmStage;
  probability: number;
  expectedCloseDate?: string;
  actualCloseDate?: string;
  contact?: contact;
  company?: company;
  owner?: user;
  description?: string;
  notes?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
