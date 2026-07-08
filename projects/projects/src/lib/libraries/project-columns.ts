import { tableColumn } from '@avalantec/base-app/resource';
import { project } from '../interfaces/projects';

export const projectColumns: tableColumn<project>[] = [
  {
    field: 'number',
    title: 'columns.number',
    type: 'text',
    sortable: true,
  },
  {
    field: 'name',
    title: 'columns.name',
    type: 'text',
    sortable: true,
  },
  {
    field: 'contactId.fullName',
    title: 'columns.contact',
    type: 'text',
  },
  {
    field: 'description',
    title: 'columns.description',
    parseField: (value: string | null | undefined) => (value && value.trim() ? value : 'Not set'),
    type: 'text',
  },
  {
    field: 'dateStart',
    title: 'columns.startDate',
    type: 'date',
  },
  {
    field: 'dateEnd',
    title: 'columns.endDate',
    type: 'date',
  },
  {
    field: 'active',
    title: 'columns.active',
    type: 'text',
  },
];
