import { tableColumn } from '@avalantec/base-app/resource';
import { pricingEstimate } from '../interfaces/pricing-estimate';

export const pricingEstimateColumns: tableColumn<pricingEstimate>[] = [
  {
    field: 'number',
    title: 'sales.columns.estimateNumber',
    type: 'text',
  },
  {
    field: 'date',
    title: 'sales.columns.date',
    type: 'date',
    sortable: true,
  },
  {
    field: 'requestText',
    title: 'sales.columns.requestSummary',
    type: 'text',
  },
  {
    field: 'totalCustomer',
    title: 'sales.columns.totalCustomer',
    type: 'currency',
    sortable: true,
  },
  {
    field: 'preparedBy',
    title: 'sales.columns.preparedBy',
    type: 'text',
  },
  {
    field: 'status',
    title: 'sales.columns.status',
    type: 'text',
  },
];
