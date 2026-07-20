import { filter } from '@avalantec/base-app/resource';
import { vendor } from '../interfaces/vendors';

/** Filter configuration for vendor list */
export const vendorFilters: filter<vendor>[] = [
  { field: 'vendorId', type: 'string' },
  { field: 'active', type: 'boolean' },
];
