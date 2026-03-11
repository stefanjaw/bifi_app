import { tableColumn } from '@avalantec/base-app/resource';
import { fiscalPosition } from '../interfaces/fiscal-position';

export const fiscalPositionColumns: tableColumn<fiscalPosition>[] = [
  { field: 'name', title: 'Name', type: 'text', sortable: true },
  { field: 'active', title: 'Active', type: 'text' },
];
