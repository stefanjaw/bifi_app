import { DynamicComponentConfig, tableColumn } from '@avalantec/base-app/resource';
import { shipping } from '../interfaces/shipping';
import { Tag } from 'primeng/tag';
import { getBCDStatusConfig } from '../../bcds';
import { getShippingStatusConfig } from './shipping-utils';

export const shippingColumns: tableColumn<shipping>[] = [
  {
    field: 'name',
    title: 'Shipment',
    type: 'text',
    sortable: true,
  },
  {
    field: 'createdAt',
    title: 'Date',
    type: 'date',
    sortable: true,
  },
  {
    field: 'status',
    title: 'Status',
    type: 'text',
    sortable: true,
    component: (value: shipping) => {
      // if bcds are available, get the last one
      const bcdStatus =
        value.bcds && value.bcds.length > 0
          ? getBCDStatusConfig(value.bcds[value.bcds.length - 1].status)
          : undefined;

      // get the shipping status
      const shippingStatus = getShippingStatusConfig(value.status);

      // create the component
      const input = bcdStatus
        ? { ...bcdStatus, value: `${bcdStatus.value} (${shippingStatus.value})` }
        : shippingStatus;

      const component: DynamicComponentConfig<any> = {
        component: Tag,
        inputs: { ...input, value: input.value },
        outputs: {},
      };

      return component;
    },
  },
];
