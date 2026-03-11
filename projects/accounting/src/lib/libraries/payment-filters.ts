import { filter } from '@avalantec/base-app/resource';
import { payment } from '../interfaces/payment';

export const paymentFilters: filter<payment>[] = [
  { field: 'paymentType', operator: 'like', type: 'string' },
];
