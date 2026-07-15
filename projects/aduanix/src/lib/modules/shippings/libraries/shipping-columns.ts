import { DynamicComponentConfig, tableColumn } from '@avalantec/base-app/resource';
import { t } from '@avalantec/base-app/i18n';
import { shipping } from '../interfaces/shipping';
import { Tag } from 'primeng/tag';
import { getBCDStatusConfig } from '../../bcds';
import { getShippingStatusConfig } from './shipping-utils';

export const shippingColumns: tableColumn<shipping>[] = [
  {
    field: 'name',
    title: 'column.shipment',
    type: 'text',
    sortable: true,
  },
  {
    field: 'createdAt',
    title: 'column.date',
    type: 'date',
    sortable: true,
  },
  {
    field: 'status',
    title: 'column.status',
    type: 'text',
    sortable: true,
    component: (value: shipping) => {
      const bcdStatus =
        value.bcds && value.bcds.length > 0
          ? getBCDStatusConfig(value.bcds[value.bcds.length - 1].status)
          : undefined;

      const shippingStatus = getShippingStatusConfig(value.status);

      const displayValue = bcdStatus
        ? `${t(bcdStatus.value, {}, 'aduanix')} (${t(shippingStatus.value, {}, 'aduanix')})`
        : t(shippingStatus.value, {}, 'aduanix');

      const component: DynamicComponentConfig<any> = {
        component: Tag,
        inputs: {
          value: displayValue,
          severity: bcdStatus?.severity || shippingStatus.severity,
        },
        outputs: {},
      };

      return component;
    },
  },
];
