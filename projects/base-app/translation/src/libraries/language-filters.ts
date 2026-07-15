import { filter } from '@avalantec/base-app/resource';
import { languageRecord } from '@avalantec/base-app/i18n';

/** Filter definitions for the Languages list */
export const languageFilters: filter<languageRecord>[] = [
  { field: 'locale', type: 'string' },
  { field: 'name', type: 'string' },
];
