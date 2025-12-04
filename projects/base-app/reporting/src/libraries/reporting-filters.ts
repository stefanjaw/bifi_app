import { reporting } from '@avalantec/base-app/interfaces';
import { filter } from '@avalantec/base-app/resource';

export const reportingFilters: filter<reporting>[] = [
  {
    field: 'title',
    type: 'string',
  },
  {
    field: 'model',
    type: 'string',
  },
];
