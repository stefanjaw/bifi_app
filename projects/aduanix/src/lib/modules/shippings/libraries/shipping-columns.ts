import { DynamicComponent, tableColumn } from '@avalantec/base-app/resource';
import { shipping } from '../interfaces/shipping';
import { Tag } from 'primeng/tag';

export const shippingColumns: tableColumn<shipping>[] = [
  {
    field: 'name',
    title: 'Shipping',
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
      const inputs: { text: string; variant: Tag['severity'] } = (() => {
        switch (value.status) {
          case 'PDF_PROCESSED':
            return {
              text: 'PDF Processed',
              variant: 'success',
            };
          case 'ERROR':
            return {
              text: 'Error',
              variant: 'danger',
            };
          case 'UPLOADING':
            return {
              text: 'Uploading',
              variant: 'info',
            };
          case 'BCD_SENT':
            return {
              text: 'BCD Sent',
              variant: 'success',
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
  },
];
