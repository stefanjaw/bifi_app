import { tableColumn } from '@avalantec/base-app/resource';
import { languageRecord } from '@avalantec/base-app/i18n';

/** Table column definitions for the Languages list */
export const languageColumns: tableColumn<languageRecord>[] = [
  { field: 'locale', title: 'Locale', type: 'text', sortable: true },
  { field: 'name', title: 'Name', type: 'text', sortable: true },
  { field: 'nativeName', title: 'Native Name', type: 'text', sortable: true },
  { field: 'active', title: 'Active', type: 'text', sortable: true },
];
