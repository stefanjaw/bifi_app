import { tableColumn } from '@avalantec/base-app/resource';
import { translationRecord } from '../interfaces/translation';

/** Table column definitions for the Translations list */
export const translationColumns: tableColumn<translationRecord>[] = [
  { field: 'locale', title: 'Locale', type: 'text', sortable: true },
  { field: 'scope', title: 'Scope', type: 'text', sortable: true },
  { field: 'key', title: 'Key', type: 'text', sortable: true },
  { field: 'value', title: 'Value', type: 'text' },
  { field: 'active', title: 'Active', type: 'text', sortable: true },
];
