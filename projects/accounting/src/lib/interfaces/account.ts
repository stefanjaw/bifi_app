import { currency } from '@avalantec/base-app/currency';
import { company } from '@avalantec/base-app/interfaces';

export interface account {
  _id: string;
  companyId?: company;
  code: string;
  name: string;
  type: 'asset' | 'liability' | 'equity' | 'income' | 'expense';
  parentAccountId?: account;
  currencyId?: currency;
  active: boolean;
}
