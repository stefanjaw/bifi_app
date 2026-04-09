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
  { field: 'name', label: 'Name', type: 'string' },
  { field: 'description', label: 'Description', type: 'string' },
  { field: 'stage.name', label: 'Stage', type: 'string' },
  { field: 'createdBy.username', label: 'Created by username', type: 'string' },
  { field: 'createdBy.email', label: 'Created by email', type: 'string' },
  { field: 'contactId.name', label: 'Contact name', type: 'string' },
  { field: 'contactId.lastName', label: 'Contact last name', type: 'string' },
  { field: 'dateStart', label: 'Start date', type: 'date' },
  { field: 'dateEnd', label: 'End date', type: 'date' },
  { field: 'priority', label: 'Priority', type: 'string' },
  { field: 'active', label: 'Active', type: 'boolean' },
];
