import { account } from './account';
import { journal } from './journal';
import { tax } from './tax';
import { discount } from './discount';
import { paymentTerm } from './payment-term';
import { fiscalPosition } from './fiscal-position';

export interface invoice_line {
  _id?: string;
  productId?: { _id: string; name: string; salePrice: number };
  description?: string;
  accountId: account;
  quantity: number;
  unitOfMeasureId?: { _id: string; name: string; symbol: string };
  unitPrice: number;
  taxIds: tax[];
  discountId?: discount;
  amount: number;
}

export interface invoice {
  _id: string;
  number?: string;
  state: 'draft' | 'posted' | 'cancel';
  contactId?: { _id: string; name: string; lastName?: string };
  paymentTermId?: paymentTerm;
  invoiceDate: string;
  dueDate?: string;
  journalId: journal;
  salespersonId?: { _id: string; name: string; lastName?: string; email: string };
  paymentReference?: string;
  fiscalPositionId?: fiscalPosition;
  companyId?: { _id: string; name: string };
  currencyId: { _id: string; name: string; code: string; symbol: string };
  lines: invoice_line[];
  untaxedAmount: number;
  taxAmount: number;
  totalAmount: number;
  amountDue: number;
  journalEntryId?: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}
