import { tableColumn } from '@avalantec/base-app/resource';
import { payment } from '../interfaces/payment';

export const paymentColumns: tableColumn<payment>[] = [
  { field: 'paymentType', title: 'type', type: 'text' },
  { field: 'partnerId.name', title: 'partner', type: 'text' },
  { field: 'journalId.name', title: 'journal', type: 'text' },
  { field: 'amount', title: 'amount', type: 'number' },
  { field: 'currencyId.code', title: 'currency', type: 'text' },
  { field: 'paymentDate', title: 'date', type: 'date' },
  { field: 'status', title: 'status', type: 'text' },
];
