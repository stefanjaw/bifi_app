import { tableColumn } from '@avalantec/base-app/resource';
import { contact } from '../interfaces/contacts';

export const contactColumns: tableColumn<contact>[] = [
  {
    field: 'name',
    title: 'Contact Name',
    type: 'text',
  },
  {
    field: 'lastName',
    title: 'Last Name',
    type: 'text',
  },
  {
    field: 'phoneNumber',
    title: 'Phone Number',
    type: 'text',
  },
  {
    field: 'email',
    title: 'Email',
    type: 'text',
  },
  {
    field: 'parentId.name',
    title: 'Parent Contact',
    type: 'text',
  },
  {
    field: 'type',
    title: 'Type',
    type: 'text',
    sortable: true,
  },
  {
    field: 'childIds',
    title: 'Child Contacts',
    type: 'text',
    parseField: (row: contact[]) => row?.map(child => child.name).join(', ') || 'Not set',
  },
];
