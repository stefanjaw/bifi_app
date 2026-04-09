import { tableColumn } from '@avalantec/base-app/resource';
import { project } from '../interfaces/projects';

export const projectColumns: tableColumn<project>[] = [
  {
    field: 'number',
    title: 'Number',
    type: 'text',
    sortable: true,
  },
  {
    field: 'name',
    title: 'Name',
    type: 'text',
    sortable: true,
  },
  {
    field: 'contactId.fullName',
    title: 'Contact',
    type: 'text',
  },
  {
    field: 'description',
    title: 'Description',
    parseField: (value: string | null | undefined) => (value && value.trim() ? value : 'Not set'),
    type: 'text',
  },
  {
    field: 'active',
    title: 'Active',
    type: 'text',
  },
];
