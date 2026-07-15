import { tableColumn } from '@avalantec/base-app/resource';
import { paymentTerm } from '../interfaces/payment-term';

export const paymentTermColumns: tableColumn<paymentTerm>[] = [
  { field: 'name', title: 'name', type: 'text', sortable: true },
  { field: 'active', title: 'active', type: 'text' },
];
