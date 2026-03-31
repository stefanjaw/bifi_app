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
  { field: 'name', label: 'Subject', type: 'string' },
  { field: 'priority', label: 'Priority', type: 'string' },
  { field: 'stage.name', label: 'Stage', type: 'string' },
  { field: 'assigned.username', label: 'Assigned user by username', type: 'string' },
  { field: 'assigned.email', label: 'Assigned user by email', type: 'string' },
  { field: 'type', label: 'Type', type: 'string' },
  { field: 'category', label: 'Category', type: 'string' },
  { field: 'appModule', label: 'Module', type: 'string' },
  { field: 'slaResolutionDeadline', label: 'SLA Deadline', type: 'date' },
  { field: 'createdAt', label: 'Created date', type: 'date' },
  { field: 'active', label: 'Active', type: 'boolean' },
];
