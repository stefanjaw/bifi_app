import { filter } from '@avalantec/base-app/resource';
import { emailCampaign } from '../interfaces/email-campaign';

export const emailCampaignFilters: filter<emailCampaign>[] = [
  {
    field: 'name',
    type: 'string',
  },
];
