import { filter, filterFieldConfig } from '@avalantec/base-app/resource';
import { project } from '../interfaces/projects';

export const projectFilters: filter<project>[] = [
  {
    field: 'name',
    type: 'string',
  },
  {
    field: 'description',
    type: 'string',
  },
  {
    field: 'stage.name',
    type: 'string',
  },
  {
    field: 'createdBy.username',
    type: 'string',
  },
  {
    field: 'createdBy.email',
    type: 'string',
  },
  {
    field: 'contactId.name',
    type: 'string',
  },
  {
    field: 'contactId.lastName',
    type: 'string',
  },
];

export const projectFilterFields: filterFieldConfig<project>[] = [
  { field: 'name', label: 'filters.name', type: 'string' },
  { field: 'description', label: 'filters.description', type: 'string' },
  { field: 'stage.name', label: 'filters.stage', type: 'string' },
  { field: 'createdBy.username', label: 'filters.createdByUsername', type: 'string' },
  { field: 'createdBy.email', label: 'filters.createdByEmail', type: 'string' },
  { field: 'contactId.name', label: 'filters.contactName', type: 'string' },
  { field: 'contactId.lastName', label: 'filters.contactLastName', type: 'string' },
  { field: 'dateStart', label: 'filters.startDate', type: 'date' },
  { field: 'dateEnd', label: 'filters.endDate', type: 'date' },
  { field: 'priority', label: 'filters.priority', type: 'string' },
  { field: 'active', label: 'filters.active', type: 'boolean' },
];
