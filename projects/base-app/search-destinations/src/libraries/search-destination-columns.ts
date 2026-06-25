import { tableColumn } from '@avalantec/base-app/resource';
import { searchDestination } from '../interfaces/search-destination';

export const searchDestinationColumns: tableColumn<searchDestination>[] = [
  {
    field: 'label',
    title: 'Label',
    type: 'text',
    sortable: true,
  },
  {
    field: 'group',
    title: 'Area',
    type: 'text',
    sortable: true,
  },
  {
    field: 'route',
    title: 'Route',
    type: 'text',
  },
  {
    field: 'keywords',
    title: 'Phrases',
    type: 'text',
    parseField: (value: any) => (Array.isArray(value) && value.length ? value.join(', ') : '—'),
  },
  {
    field: 'active',
    title: 'Active',
    type: 'text',
  },
];
