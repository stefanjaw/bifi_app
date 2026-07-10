import { t } from '@avalantec/base-app/i18n';
import { tableColumn } from '@avalantec/base-app/resource';
import { searchDestination } from '../interfaces/search-destination';

export const searchDestinationColumns: tableColumn<searchDestination>[] = [
  {
    field: 'label',
    title: 'label',
    type: 'text',
    sortable: true,
  },
  {
    field: 'group',
    title: 'area',
    type: 'text',
    sortable: true,
  },
  {
    field: 'route',
    title: 'route',
    type: 'text',
  },
  {
    field: 'keywords',
    title: 'phrases',
    type: 'text',
    parseField: (value: any) =>
      Array.isArray(value) && value.length
        ? value.join(', ')
        : t('status.fallback.dash', {}, 'base-app/search-destinations'),
  },
  {
    field: 'active',
    title: 'active',
    type: 'text',
  },
];
