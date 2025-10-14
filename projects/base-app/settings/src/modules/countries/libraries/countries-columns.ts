import { tableColumn } from '@avalantec/base-app/resource';
import { country } from '../interfaces/country';

export const countryColumns: tableColumn<country>[] = [
  {
    field: 'name',
    title: 'Company Name',
    type: 'text',
    sortable: true,
  },
  {
    field: 'code',
    title: 'Code',
    type: 'text',
    sortable: true,
  },
  {
    field: 'currencyCode',
    title: 'Currency Code',
    type: 'text',
    sortable: true,
  },
  {
    field: 'currencySymbol',
    title: 'Currency Symbol',
    type: 'text',
    sortable: true,
  },
];
