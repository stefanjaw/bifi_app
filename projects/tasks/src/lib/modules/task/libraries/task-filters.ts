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
  {
    field: 'assigned.email',
    type: 'string',
  },
  {
    field: 'projectId.name',
    type: 'string',
  },
  {
    field: 'typeId.name',
    type: 'string',
  },
];

export const taskFilterFields: filterFieldConfig<task>[] = [
  { field: 'name', label: 'filters.name', type: 'string' },
  { field: 'priority', label: 'filters.priority', type: 'string' },
  { field: 'stage.name', label: 'filters.stage', type: 'string' },
  { field: 'assigned.username', label: 'filters.assignedUserByUsername', type: 'string' },
  { field: 'assigned.email', label: 'filters.assignedUserByEmail', type: 'string' },
  { field: 'projectId.name', label: 'filters.project', type: 'string' },
  { field: 'typeId.name', label: 'filters.type', type: 'string' },
  { field: 'plannedStartDate', label: 'filters.startDate', type: 'date' },
  { field: 'plannedEndDate', label: 'filters.endDate', type: 'date' },
  { field: 'progress', label: 'filters.progress', type: 'number' },
  { field: 'active', label: 'filters.active', type: 'boolean' },
];
