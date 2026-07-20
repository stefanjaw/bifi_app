import { tableColumn } from '@avalantec/base-app/resource';
import { vendor } from '../interfaces/vendors';

/** Column definitions for vendor list */
export const vendorColumns: tableColumn<vendor>[] = [
  { field: 'vendorId', title: 'vendorId', type: 'text' },
  { field: 'startDate', title: 'startDate', type: 'date' },
  {
    field: 'active',
    title: 'active',
    type: 'text',
    parseField: (v: boolean) => (v ? 'Yes' : 'No'),
  },
];
