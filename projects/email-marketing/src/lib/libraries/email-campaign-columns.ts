import { tableColumn } from '@avalantec/base-app/resource';
import { emailCampaign } from '../interfaces/email-campaign';

export const emailCampaignColumns: tableColumn<emailCampaign>[] = [
  {
    field: 'name',
    title: 'Name',
    type: 'text',
    sortable: true,
  },
  {
    field: 'subject',
    title: 'Subject',
    type: 'text',
  },
  {
    field: 'status',
    title: 'Status',
    type: 'text',
    sortable: true,
  },
  {
    field: 'stats',
    title: 'Recipients',
    type: 'text',
    parseField: (value: emailCampaign['stats']) =>
      String(value?.recipients ?? 0),
  },
  {
    field: 'stats',
    title: 'Sent',
    type: 'text',
    parseField: (value: emailCampaign['stats']) => String(value?.sent ?? 0),
  },
  {
    field: 'stats',
    title: 'Opened',
    type: 'text',
    parseField: (value: emailCampaign['stats']) => String(value?.opened ?? 0),
  },
  {
    field: 'scheduledAt',
    title: 'Scheduled',
    type: 'date',
  },
];
