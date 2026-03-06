import { currency } from '@avalantec/base-app/currency';
import { company } from '@avalantec/base-app/interfaces';
import { journal } from './journal';
import { account } from './account';

export interface journalEntryLine {
  _id?: string;
  accountId: account;
  description?: string;
  debit: number;
  credit: number;
}

export interface journalEntry {
  _id: string;
  journalId: journal;
  date: string;
  reference?: string;
  currencyId: currency;
  status: 'draft' | 'posted';
  companyId?: company;
  lines: journalEntryLine[];
}
