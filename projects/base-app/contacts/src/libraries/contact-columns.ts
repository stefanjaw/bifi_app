import { contact } from '@avalantec/base-app/core';
import { tableColumn } from '@avalantec/base-app/resource';

export const contactColumns: tableColumn<contact>[] = [
  {
    field: 'name',
    title: 'Contact Name',
    type: 'text',
    sortable: true,
  },
  {
    field: 'lastName',
    title: 'Last Name',
    type: 'text',
    sortable: true,
  },
  {
    field: 'phoneNumber',
    title: 'Phone Number',
    type: 'text',
    sortable: true,
  },
  {
    field: 'email',
    title: 'Email',
    type: 'text',
    sortable: true,
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
  {
    field: 'countryId.name',
    title: 'Country',
    type: 'text',
  },
  {
    field: 'streetAddress',
    title: 'Street Address',
    type: 'text',
  },
  {
    field: 'streetAddress2',
    title: 'Street Address 2',
    type: 'text',
  },
];
