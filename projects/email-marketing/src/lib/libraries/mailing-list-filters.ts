import { filter } from '@avalantec/base-app/resource';
import { mailingList } from '../interfaces/mailing-list';

export const mailingListFilters: filter<mailingList>[] = [
  {
    field: 'name',
    type: 'string',
  },
];
