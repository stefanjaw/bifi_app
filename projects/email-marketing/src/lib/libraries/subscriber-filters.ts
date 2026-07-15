import { filter } from '@avalantec/base-app/resource';
import { subscriber } from '../interfaces/subscriber';

export const subscriberFilters: filter<subscriber>[] = [
  {
    field: 'email',
    type: 'string',
  },
];
