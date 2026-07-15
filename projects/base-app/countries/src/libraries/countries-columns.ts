import { country } from '@avalantec/base-app/interfaces';
import { tableColumn } from '@avalantec/base-app/resource';

export const countryColumns: tableColumn<country>[] = [
  {
    field: 'name',
    title: 'countryName',
    type: 'text',
    sortable: true,
  },
  {
    field: 'code',
    title: 'code',
    type: 'text',
    sortable: true,
  },
  {
    field: 'currencyCode',
    title: 'currencyCode',
    type: 'text',
    sortable: true,
  },
  {
    field: 'currencySymbol',
    title: 'currencySymbol',
    type: 'text',
    sortable: true,
  },
];
