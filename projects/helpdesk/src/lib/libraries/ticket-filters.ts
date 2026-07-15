import { filter, filterFieldConfig } from '@avalantec/base-app/resource';
import { ticket } from '../interfaces/ticket';

export const ticketFilters: filter<ticket>[] = [
  {
    field: 'name',
    type: 'string',
  },
  {
    field: 'type',
    type: 'string',
  },
  {
    field: 'priority',
    type: 'string',
  },
  {
    field: 'stage.name',
    type: 'string',
  },
  {
    field: 'category',
    type: 'string',
  },
  {
    field: 'appModule',
    type: 'string',
  },
  {
    field: 'assigned.username',
    type: 'string',
  },
  {
    field: 'assigned.email',
    type: 'string',
  },
];

export const ticketFilterFields: filterFieldConfig<ticket>[] = [
  { field: 'name', label: 'filters.subject', type: 'string' },
  { field: 'priority', label: 'filters.priority', type: 'string' },
  { field: 'stage.name', label: 'filters.stage', type: 'string' },
  { field: 'assigned.username', label: 'filters.assignedUserByUsername', type: 'string' },
  { field: 'assigned.email', label: 'filters.assignedUserByEmail', type: 'string' },
  { field: 'type', label: 'filters.type', type: 'string' },
  { field: 'category', label: 'filters.category', type: 'string' },
  { field: 'appModule', label: 'filters.module', type: 'string' },
  { field: 'slaResolutionDeadline', label: 'filters.slaDeadline', type: 'date' },
  { field: 'createdAt', label: 'filters.createdDate', type: 'date' },
  { field: 'active', label: 'filters.active', type: 'boolean' },
];
