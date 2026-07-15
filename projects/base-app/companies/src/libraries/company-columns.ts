import { company } from '@avalantec/base-app/interfaces';
import { tableColumn } from '@avalantec/base-app/resource';

export const companyColumns: tableColumn<company>[] = [
  {
    field: 'name',
    title: 'companyName',
    type: 'text',
    sortable: true,
  },
  {
    field: 'countryId.name',
    title: 'country',
    type: 'text',
  },
  {
    field: 'address',
    title: 'address',
    type: 'text',
    sortable: true,
  },
  {
    field: 'contactId.name',
    title: 'relatedContact',
    type: 'text',
  },
];
