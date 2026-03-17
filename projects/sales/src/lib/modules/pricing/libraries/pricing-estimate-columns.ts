import { tableColumn } from '@avalantec/base-app/resource';
import { pricingEstimate } from '../interfaces/pricing-estimate';

export const pricingEstimateColumns: tableColumn<pricingEstimate>[] = [
  {
    field: 'number',
    title: 'Estimate #',
    type: 'text',
  },
  {
    field: 'date',
    title: 'Date',
    type: 'date',
    sortable: true,
  },
  {
    field: 'requestText',
    title: 'Request Summary',
    type: 'text',
  },
  {
    field: 'totalCustomer',
    title: 'Total Customer',
    type: 'currency',
    sortable: true,
  },
  {
    field: 'preparedBy',
    title: 'Prepared By',
    type: 'text',
  },
  {
    field: 'status',
    title: 'Status',
    type: 'text',
  },
];
