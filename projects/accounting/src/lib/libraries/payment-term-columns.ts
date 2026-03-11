import { tableColumn } from '@avalantec/base-app/resource';
import { paymentTerm } from '../interfaces/payment-term';

export const paymentTermColumns: tableColumn<paymentTerm>[] = [
  { field: 'name', title: 'Name', type: 'text', sortable: true },
  { field: 'active', title: 'Active', type: 'text' },
];
