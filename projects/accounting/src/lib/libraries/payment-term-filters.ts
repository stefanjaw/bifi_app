import { filter } from '@avalantec/base-app/resource';
import { paymentTerm } from '../interfaces/payment-term';

export const paymentTermFilters: filter<paymentTerm>[] = [
  { field: 'name', operator: 'like', type: 'string' },
];
