import { filter } from '@avalantec/base-app/resource';
import { translationRecord } from '../interfaces/translation';

/** Filter definitions for the Translations list */
export const translationFilters: filter<translationRecord>[] = [
  { field: 'locale', type: 'string' },
  { field: 'scope', type: 'string' },
  { field: 'key', type: 'string' },
];
