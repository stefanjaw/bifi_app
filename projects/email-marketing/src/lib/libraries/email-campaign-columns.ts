import { tableColumn } from '@avalantec/base-app/resource';
import { emailCampaign } from '../interfaces/email-campaign';

export const emailCampaignColumns: tableColumn<emailCampaign>[] = [
  {
    field: 'name',
    title: 'name',
    type: 'text',
    sortable: true,
  },
  {
    field: 'subject',
    title: 'subject',
    type: 'text',
  },
  {
    field: 'status',
    title: 'status',
    type: 'text',
    sortable: true,
  },
  {
    field: 'stats',
    title: 'recipients',
    type: 'text',
    parseField: (value: emailCampaign['stats']) => String(value?.recipients ?? 0),
  },
  {
    field: 'stats',
    title: 'sent',
    type: 'text',
    parseField: (value: emailCampaign['stats']) => String(value?.sent ?? 0),
  },
  {
    field: 'stats',
    title: 'opened',
    type: 'text',
    parseField: (value: emailCampaign['stats']) => String(value?.opened ?? 0),
  },
  {
    field: 'scheduledAt',
    title: 'scheduled',
    type: 'date',
  },
];
