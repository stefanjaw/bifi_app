import { tableColumn } from '@avalantec/base-app/resource';
import { translationRecord } from '../interfaces/translation';

/** Table column definitions for the Translations list */
export const translationColumns: tableColumn<translationRecord>[] = [
  { field: 'locale', title: 'locale', type: 'text', sortable: true },
  { field: 'scope', title: 'scope', type: 'text', sortable: true },
  { field: 'key', title: 'key', type: 'text', sortable: true },
  { field: 'value', title: 'value', type: 'text' },
  { field: 'active', title: 'active', type: 'text', sortable: true },
];
