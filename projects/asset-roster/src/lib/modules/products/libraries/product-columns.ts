import { product } from '../interfaces/product';
import { productType } from '../../product-types';
import { DynamicComponent, tableColumn } from '@avalantec/base-app/resource';
import { contact } from '@avalantec/base-app/interfaces';
import { Tag } from 'primeng/tag';

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
    sortable: true,
    title: 'MODEL',
    type: 'text',
  },
  {
    field: 'serialNumber',
    sortable: true,
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
    sortable: true,
    title: 'ACQUIRED DATE',
    type: 'date',
  },
  {
    field: 'maintenanceDate',
    sortable: true,
    title: 'NEXT PM DUE',
    type: 'date',
  },
  {
    field: 'status',
    sortable: true,
    component: (value: product) => {
      const inputs: { text: string; variant: Tag['severity'] } = (() => {
        switch (value.status) {
          case 'active':
            return {
              text: 'Active',
              variant: 'success',
            };
          case 'awaiting-commissioning':
            return {
              text: 'Awaiting commissioning',
              variant: 'warn',
            };
          case 'under-service':
            return {
              text: 'Under service',
              variant: 'warn',
            };
          case 'decommissioned':
            return {
              text: 'Decommissioned',
              variant: 'danger',
            };
          case 'in-pm':
            return {
              text: 'In PM',
              variant: 'info',
            };
          default: {
            return {
              text: 'Unknown',
              variant: 'warn',
            };
          }
        }
      })();

      const component: DynamicComponent<any> = {
        component: Tag,
        inputs: {
          value: inputs.text,
          severity: inputs.variant,
        },
        outputs: {},
      };

      return component;
    },
    title: 'STATUS',
    type: 'text',
  },
];
