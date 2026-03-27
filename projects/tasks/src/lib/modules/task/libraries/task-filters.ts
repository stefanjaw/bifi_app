import { filter, filterFieldConfig } from '@avalantec/base-app/resource';
import { task } from '../interfaces/task';

export const taskFilters: filter<task>[] = [
  {
    field: 'name',
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
    field: 'assigned.username',
    type: 'string',
  },
];

export const taskFilterFields: filterFieldConfig<task>[] = [
  { field: 'name', label: 'Name', type: 'string' },
  { field: 'priority', label: 'Priority', type: 'string' },
  { field: 'stage.name', label: 'Stage', type: 'string' },
  { field: 'assigned.username', label: 'Assigned user', type: 'string' },
  { field: 'plannedStartDate', label: 'Start date', type: 'date' },
  { field: 'plannedEndDate', label: 'End date', type: 'date' },
  { field: 'progress', label: 'Progress', type: 'number' },
  { field: 'active', label: 'Active', type: 'boolean' },
];
