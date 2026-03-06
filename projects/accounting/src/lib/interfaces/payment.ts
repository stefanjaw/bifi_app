import { currency } from '@avalantec/base-app/currency';
import { contact } from '@avalantec/base-app/interfaces';
import { journal } from './journal';

export interface payment {
  _id: string;
  paymentType: 'inbound' | 'outbound';
  partnerId?: contact;
  journalId: journal;
  amount: number;
  currencyId: currency;
  paymentDate: string;
  reference?: string;
  journalEntryId?: string;
  exchangeRate?: number;
  status: 'draft' | 'confirmed';
}
