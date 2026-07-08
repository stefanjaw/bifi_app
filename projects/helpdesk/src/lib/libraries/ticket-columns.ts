import { tableColumn } from '@avalantec/base-app/resource';
import { ticket } from '../interfaces/ticket';

export const ticketColumns: tableColumn<ticket>[] = [
  {
    field: 'number',
    title: 'columns.number',
    type: 'text',
    parseField: (value: string) => value ?? '—',
  },
  {
    field: 'active',
    title: 'columns.active',
    type: 'text',
    parseField: (value: boolean) => (value ? 'Active' : 'Inactive'),
  },
  {
    field: 'name',
    title: 'columns.subject',
    type: 'text',
    sortable: true,
  },
  {
    field: 'priority',
    title: 'columns.priority',
    type: 'text',
    sortable: true,
  },
  {
    field: 'type',
    title: 'columns.type',
    type: 'text',
  },
  {
    field: 'stage',
    title: 'columns.stage',
    type: 'text',
    parseField: (value: any) => value?.name ?? '—',
  },
  {
    field: 'assigned',
    title: 'columns.assigned',
    type: 'text',
    parseField: (value: any) => value?.username ?? value?.contactId?.name ?? '—',
  },
  {
    field: 'category',
    title: 'columns.category',
    type: 'text',
  },
  {
    field: 'dateStart',
    title: 'columns.startDate',
    type: 'date',
  },
  {
    field: 'dateEnd',
    title: 'columns.endDate',
    type: 'date',
  },
  {
    field: 'slaResolutionDeadline',
    title: 'columns.slaDeadline',
    type: 'date',
  },
];
