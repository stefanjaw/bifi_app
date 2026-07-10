import { t } from '@avalantec/base-app/i18n';
import { DynamicComponentConfig, tableColumn } from '@avalantec/base-app/resource';
import { ticket } from '../interfaces/ticket';
import { Tag } from 'primeng/tag';

export const ticketColumns: tableColumn<ticket>[] = [
  {
    field: 'number',
    title: 'columns.number',
    type: 'text',
    parseField: (value: string) => value ?? t('status.fallback.dash', {}, 'helpdesk'),
  },
  {
    field: 'active',
    title: 'columns.active',
    type: 'text',
    parseField: (value: boolean) =>
      value ? t('status.active', {}, 'helpdesk') : t('status.inactive', {}, 'helpdesk'),
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
    component: (value: ticket): DynamicComponentConfig<any> => {
      const configs: Record<string, { text: string; severity: Tag['severity'] }> = {
        low: { text: t('priority.low', {}, 'helpdesk'), severity: 'info' },
        medium: { text: t('priority.medium', {}, 'helpdesk'), severity: 'warn' },
        high: { text: t('priority.high', {}, 'helpdesk'), severity: 'danger' },
        urgent: { text: t('priority.urgent', {}, 'helpdesk'), severity: 'danger' },
      };
      const cfg = configs[value.priority] ?? {
        text: value.priority,
        severity: 'contrast' as const,
      };
      return { component: Tag, inputs: { value: cfg.text, severity: cfg.severity }, outputs: {} };
    },
  },
  {
    field: 'type',
    title: 'columns.type',
    type: 'text',
    parseField: (value: string) =>
      value === 'task' ? t('type.task', {}, 'helpdesk') : t('type.helpdesk', {}, 'helpdesk'),
  },
  {
    field: 'stage',
    title: 'columns.stage',
    type: 'text',
    parseField: (value: any) => value?.name ?? t('status.fallback.dash', {}, 'helpdesk'),
  },
  {
    field: 'assigned',
    title: 'columns.assigned',
    type: 'text',
    parseField: (value: any) =>
      value?.username ?? value?.contactId?.name ?? t('status.fallback.dash', {}, 'helpdesk'),
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
