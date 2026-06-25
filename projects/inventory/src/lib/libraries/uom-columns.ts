import { tableColumn } from '@avalantec/base-app/resource';
import { uom } from '../interfaces/uom';

export const uomColumns: tableColumn<uom>[] = [
  { field: 'name', title: 'Name', type: 'text' },
  { field: 'symbol', title: 'Symbol', type: 'text' },
  { field: 'categoryId', title: 'Category', type: 'text', parseField: value => value?.name ?? '' },
  { field: 'active', title: 'Active', type: 'text' },
];
