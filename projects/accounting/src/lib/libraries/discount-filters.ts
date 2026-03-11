import { filter } from '@avalantec/base-app/resource';
import { discount } from '../interfaces/discount';

export const discountFilters: filter<discount>[] = [
  { field: 'name', operator: 'like', type: 'string' },
];
