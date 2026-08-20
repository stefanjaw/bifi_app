import { apiKey } from '@avalantec/base-app/interfaces';
import { filter } from '@avalantec/base-app/resource';

/** Filterable fields for the self-service API keys list. */
export const apiKeyFilters: filter<apiKey>[] = [
  {
    field: 'name',
    type: 'string',
  },
  {
    field: 'createdAt',
    type: 'date',
  },
  {
    field: 'lastUsedAt',
    type: 'date',
  },
  {
    field: 'expiresAt',
    type: 'date',
  },
  {
    field: 'active',
    type: 'boolean',
  },
];
