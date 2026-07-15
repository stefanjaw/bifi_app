import { t } from '@avalantec/base-app/i18n';
import { tableColumn } from '@avalantec/base-app/resource';
import { facility } from '../interfaces/facility';
import { room } from '../interfaces/room';

export const facilityColumns: tableColumn<facility>[] = [
  {
    field: 'name',
    title: 'facilityName',
    type: 'text',
    sortable: true,
  },
  {
    field: 'contactId.name',
    title: 'relatedToContact',
    type: 'text',
    sortable: true,
  },
  {
    field: 'rooms',
    title: 'rooms',
    type: 'text',
    parseField: (value: room[]) =>
      value.map(room => room.name).join(', ') || t('status.fallback.noRooms', {}, 'asset-roster'),
  },
];
