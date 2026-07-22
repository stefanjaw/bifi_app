import { t } from '@avalantec/base-app/i18n';
import { tableColumn } from '@avalantec/base-app/resource';
import { maintenanceWindow } from '../interfaces/maintenance-window';

export const maintenanceWindowColumns: tableColumn<maintenanceWindow>[] = [
  {
    field: 'name',
    title: 'name',
    type: 'text',
    sortable: true,
  },
  {
    field: 'daysBefore',
    title: 'daysBefore',
    type: 'number',
    sortable: true,
  },
  {
    field: 'daysAfter',
    title: 'daysAfter',
    type: 'number',
    sortable: true,
  },
  {
    field: 'recurrency',
    title: 'recurrency',
    type: 'text',
    sortable: true,
    parseField: (value: string) => {
      const map: Record<string, string> = {
        daily: t('recurrence.daily', {}, 'asset-roster'),
        weekly: t('recurrence.weekly', {}, 'asset-roster'),
        monthly: t('recurrence.monthly', {}, 'asset-roster'),
        quarterly: t('recurrence.quarterly', {}, 'asset-roster'),
        'semi-anually': t('recurrence.semiAnnually', {}, 'asset-roster'),
        'semi-annually': t('recurrence.semiAnnually', {}, 'asset-roster'),
        annually: t('recurrence.annually', {}, 'asset-roster'),
      };
      return map[value] ?? value;
    },
  },
];
