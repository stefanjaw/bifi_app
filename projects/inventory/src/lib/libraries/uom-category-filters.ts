import { filter } from '@avalantec/base-app/resource';
import { uomCategory } from '../interfaces/uom-category';

export const uomCategoryFilters: filter<uomCategory>[] = [
  { field: 'name', operator: 'like', type: 'string' },
];
