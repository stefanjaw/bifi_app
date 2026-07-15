import { tableColumn } from '@avalantec/base-app/resource';
import { uom } from '../interfaces/uom';

export const uomColumns: tableColumn<uom>[] = [
  { field: 'name', title: 'name', type: 'text' },
  { field: 'symbol', title: 'symbol', type: 'text' },
  { field: 'categoryId', title: 'category', type: 'text', parseField: value => value?.name ?? '' },
  { field: 'active', title: 'active', type: 'text' },
];
