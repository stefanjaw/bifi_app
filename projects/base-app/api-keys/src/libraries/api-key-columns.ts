import { apiKey } from '@avalantec/base-app/interfaces';
import { tableColumn } from '@avalantec/base-app/resource';

/** Table column definitions for the self-service API keys list. */
export const apiKeyColumns: tableColumn<apiKey>[] = [
  {
    field: 'name',
    title: 'table.name',
    type: 'text',
    sortable: true,
  },
  {
    field: 'maskedKey',
    title: 'table.maskedKey',
    type: 'text',
  },
  {
    field: 'createdAt',
    title: 'table.createdAt',
    type: 'date',
    sortable: true,
  },
  {
    field: 'lastUsedAt',
    title: 'table.lastUsedAt',
    type: 'date',
  },
  {
    field: 'expiresAt',
    title: 'table.expiresAt',
    type: 'date',
  },
  {
    field: 'active',
    title: 'table.active',
    type: 'text',
  },
];
