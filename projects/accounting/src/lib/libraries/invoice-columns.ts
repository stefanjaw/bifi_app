import { tableColumn } from '@avalantec/base-app/resource';
import { invoice } from '../interfaces/invoice';

export const invoiceColumns: tableColumn<invoice>[] = [
  { field: 'number', title: 'Number', type: 'text' },
  { field: 'contactId.name', title: 'Contact', type: 'text' },
  { field: 'invoiceDate', title: 'Invoice Date', type: 'date' },
  { field: 'dueDate', title: 'Due Date', type: 'date' },
  { field: 'journalId.name', title: 'Journal', type: 'text' },
  { field: 'totalAmount', title: 'Total', type: 'currency' },
  { field: 'amountDue', title: 'Amount Due', type: 'currency' },
  { field: 'state', title: 'Status', type: 'text' },
  { field: 'currencyId.code', title: 'Currency', type: 'text' },
];
