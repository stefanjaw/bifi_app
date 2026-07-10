import { tableColumn } from '@avalantec/base-app/resource';
import { invoice } from '../interfaces/invoice';

export const invoiceColumns: tableColumn<invoice>[] = [
  { field: 'number', title: 'number', type: 'text' },
  { field: 'contactId.name', title: 'contact', type: 'text' },
  { field: 'invoiceDate', title: 'invoiceDate', type: 'date' },
  { field: 'dueDate', title: 'dueDate', type: 'date' },
  { field: 'journalId.name', title: 'journal', type: 'text' },
  { field: 'totalAmount', title: 'total', type: 'currency' },
  { field: 'amountDue', title: 'amountDue', type: 'currency' },
  { field: 'state', title: 'status', type: 'text' },
  { field: 'currencyId.code', title: 'currency', type: 'text' },
];
