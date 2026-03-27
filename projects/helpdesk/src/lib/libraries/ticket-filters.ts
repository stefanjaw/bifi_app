import { filter, filterFieldConfig } from '@avalantec/base-app/resource';
import { ticket } from '../interfaces/ticket';

export const ticketFilters: filter<ticket>[] = [
  {
    field: 'name',
    type: 'string',
  },
  {
    field: 'priority',
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
];

export const ticketFilterFields: filterFieldConfig<ticket>[] = [
  { field: 'name', label: 'Subject', type: 'string' },
  { field: 'priority', label: 'Priority', type: 'string' },
  { field: 'type', label: 'Type', type: 'string' },
  { field: 'category', label: 'Category', type: 'string' },
  { field: 'appModule', label: 'Module', type: 'string' },
  { field: 'slaResolutionDeadline', label: 'SLA Deadline', type: 'date' },
  { field: 'createdAt', label: 'Created date', type: 'date' },
  { field: 'active', label: 'Active', type: 'boolean' },
];
