import { tableColumn } from '@avalantec/base-app/system';
import { company } from '../interfaces/company';

export const companyColumns: tableColumn<company>[] = [
  {
    field: 'name',
    title: 'Company Name',
    type: 'text',
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
  },
];
