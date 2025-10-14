import { tableColumn } from '@avalantec/base-app/resource';
import { company } from '../interfaces/company';

export const companyColumns: tableColumn<company>[] = [
  {
    field: 'name',
    title: 'Company Name',
    type: 'text',
    sortable: true,
  },
  {
    field: 'countryId.name',
    title: 'Country',
    type: 'text',
  },
  {
    field: 'address',
    title: 'Address',
    type: 'text',
    sortable: true,
  },
  {
    field: 'contactId.name',
    title: 'Related Contact',
    type: 'text',
  },
];
