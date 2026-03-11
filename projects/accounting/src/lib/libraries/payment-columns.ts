import { tableColumn } from '@avalantec/base-app/resource';
import { payment } from '../interfaces/payment';

export const paymentColumns: tableColumn<payment>[] = [
  { field: 'paymentType', title: 'Type', type: 'text' },
  { field: 'partnerId.name', title: 'Partner', type: 'text' },
  { field: 'journalId.name', title: 'Journal', type: 'text' },
  { field: 'amount', title: 'Amount', type: 'number' },
  { field: 'currencyId.code', title: 'Currency', type: 'text' },
  { field: 'paymentDate', title: 'Date', type: 'date' },
  { field: 'status', title: 'Status', type: 'text' },
];
