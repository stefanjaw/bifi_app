import { contact } from '@avalantec/base-app/interfaces';
import { tableColumn } from '@avalantec/base-app/resource';

export const contactColumns: tableColumn<contact>[] = [
  {
    field: 'fullName',
    title: 'Contact Name',
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
    field: 'website',
    title: 'Website',
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
    field: 'fullAddress',
    title: 'Address',
    type: 'text',
    sortable: true,
  }
  
];
