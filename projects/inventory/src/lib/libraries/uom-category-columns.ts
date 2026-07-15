import { tableColumn } from '@avalantec/base-app/resource';
import { uomCategory } from '../interfaces/uom-category';

export const uomCategoryColumns: tableColumn<uomCategory>[] = [
  { field: 'name', title: 'name', type: 'text' },
  { field: 'active', title: 'active', type: 'text' },
];
