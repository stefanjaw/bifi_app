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
  { field: 'name', label: 'Name', type: 'string' },
  { field: 'priority', label: 'Priority', type: 'string' },
  { field: 'stage.name', label: 'Stage', type: 'string' },
  { field: 'assigned.username', label: 'Assigned user by username', type: 'string' },
  { field: 'assigned.email', label: 'Assigned user by email', type: 'string' },
  { field: 'projectId.name', label: 'Project', type: 'string' },
  { field: 'typeId.name', label: 'Type', type: 'string' },
  { field: 'plannedStartDate', label: 'Start date', type: 'date' },
  { field: 'plannedEndDate', label: 'End date', type: 'date' },
  { field: 'progress', label: 'Progress', type: 'number' },
  { field: 'active', label: 'Active', type: 'boolean' },
];
