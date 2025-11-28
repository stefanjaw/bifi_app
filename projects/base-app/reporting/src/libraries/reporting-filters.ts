import { reporting } from '@avalantec/base-app/interfaces';
import { filter } from '@avalantec/base-app/resource';

export const reportingFilters: filter<reporting>[] = [
  {
    field: 'model',
    type: 'string',
  },
  {
    field: 'template',
    type: 'string',
  },
];
