import { tableColumn } from '@avalantec/base-app/resource';
import { languageRecord } from '@avalantec/base-app/i18n';

/** Table column definitions for the Languages list */
export const languageColumns: tableColumn<languageRecord>[] = [
  { field: 'locale', title: 'locale', type: 'text', sortable: true },
  { field: 'name', title: 'name', type: 'text', sortable: true },
  { field: 'nativeName', title: 'nativeName', type: 'text', sortable: true },
  { field: 'active', title: 'active', type: 'text', sortable: true },
];
