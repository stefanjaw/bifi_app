import {
  contact,
  tableColumn,
  Badge,
  DynamicComponent,
  BadgeVariant,
} from '@avalantec/base-app';
import { product } from '../interfaces/product';
import { productType } from '../../product-types';

export const productColumns: tableColumn<product>[] = [
  {
    field: 'productTypeIds',
    parseField: (value: productType[]) => value[0]?.name || 'Not set',
    title: 'TYPE',
    type: 'text',
  },
  {
    field: 'makeIds',
    parseField: (value: contact[]) => value[0]?.name || 'Not set',
    title: 'MAKE',
    type: 'text',
  },
  {
    field: 'productModel',
    title: 'MODEL',
    type: 'text',
  },
  {
    field: 'serialNumber',
    title: 'SERIAL NUMBER',
    type: 'text',
  },
  {
    field: 'locationId.name',
    title: 'LOCATION',
    type: 'text',
  },
  {
    field: 'vendorIds',
    parseField: (value: contact[]) => value[0]?.name || 'Not set',
    title: 'VENDOR',
    type: 'text',
  },
  {
    field: 'acquiredDate',
    title: 'ACQUIRED DATE',
    type: 'date',
  },
  {
    field: 'pmDue',
    parseField: (value: product['pmDue']) => {
      switch (value) {
        case 'pm-not-set':
          return 'Not set';
        case 'in-pm':
          return 'In PM';
        case 'pm-due':
          return 'Due';
        case 'pm-overdue':
          return 'Overdue';
      }
    },
    title: 'NEXT PM DUE',
    type: 'text',
  },

  {
    field: 'status',
    component: (value: product) => {
      const inputs: { text: string; variant: BadgeVariant } = (() => {
        switch (value.status) {
          case 'active':
            return {
              text: 'Active',
              variant: 'success',
            };
          case 'awaiting-comissioning':
            return {
              text: 'Awaiting comissioning',
              variant: 'warning',
            };
          case 'under-service':
            return {
              text: 'Under service',
              variant: 'warning',
            };
        }
      })();

      const component: DynamicComponent<Badge> = {
        component: Badge,
        inputs: {
          text: inputs.text,
          variant: inputs.variant,
        },
        outputs: {},
      };

      return component;
    },
    title: 'STATUS',
    type: 'text',
  },
];
