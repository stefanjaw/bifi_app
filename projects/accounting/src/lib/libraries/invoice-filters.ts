import { filter } from '@avalantec/base-app/resource';
import { invoice } from '../interfaces/invoice';

export const invoiceFilters: filter<invoice>[] = [
  { field: 'number', operator: 'like', type: 'string' },
];
