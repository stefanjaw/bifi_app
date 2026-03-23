import { tableColumn } from '@avalantec/base-app/resource';
import { ticket } from '../interfaces/ticket';

export const ticketColumns: tableColumn<ticket>[] = [
  {
    field: 'name',
    title: 'Subject',
    type: 'text',
    sortable: true,
  },
  {
    field: 'priority',
    title: 'Priority',
    type: 'text',
    sortable: true,
  },
  {
    field: 'type',
    title: 'Type',
    type: 'text',
  },
  {
    field: 'stage',
    title: 'Stage',
    type: 'text',
    parseField: (value: any) => value?.name ?? '—',
  },
  {
    field: 'assigned',
    title: 'Assigned',
    type: 'text',
    parseField: (value: any) => value?.username ?? value?.contactId?.name ?? '—',
  },
  {
    field: 'category',
    title: 'Category',
    type: 'text',
  },
  {
    field: 'slaResolutionDeadline',
    title: 'SLA Deadline',
    type: 'date',
  },
  {
    field: 'active',
    title: 'Active',
    type: 'text',
    parseField: (value: boolean) => (value ? 'Active' : 'Inactive'),
  },
];
