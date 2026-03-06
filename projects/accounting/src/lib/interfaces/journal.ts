import { currency } from '@avalantec/base-app/currency';
import { account } from './account';

export interface journal {
  _id: string;
  name: string;
  code: string;
  journalType: 'sales' | 'purchase' | 'cash' | 'bank' | 'general';
  defaultDebitAccountId?: account;
  defaultCreditAccountId?: account;
  currencyId?: currency;
  active: boolean;
}
