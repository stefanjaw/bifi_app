import { filter } from '@avalantec/base-app/resource';
import { shipping } from '../interfaces/shipping';

export const shippingFilters: filter<shipping>[] = [
  {
    field: 'name',
    type: 'string',
  },

  {
    field: 'createdBy.username',
    type: 'string',
  },

  {
    field: 'status',    
    type: 'string',
  }
];
