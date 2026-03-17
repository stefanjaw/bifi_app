import { filter } from '@avalantec/base-app/resource';
import { pricingEstimate } from '../interfaces/pricing-estimate';

export const pricingEstimateFilters: filter<pricingEstimate>[] = [
  {
    field: 'number',
    type: 'string',
  },
  {
    field: 'preparedBy',
    type: 'string',
  },
];
