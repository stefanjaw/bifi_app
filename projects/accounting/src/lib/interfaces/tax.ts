import { account } from './account';

export interface tax {
  _id: string;
  name: string;
  taxType: 'sales' | 'purchase';
  percentage: number;
  accountId: account;
  active: boolean;
}
