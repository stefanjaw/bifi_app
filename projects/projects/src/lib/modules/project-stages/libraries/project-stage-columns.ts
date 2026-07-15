import { t } from '@avalantec/base-app/i18n';
import { tableColumn } from '@avalantec/base-app/resource';
import { projectStage } from '../interfaces/project-stage';

export const projectStageColumns: tableColumn<projectStage>[] = [
  {
    field: 'name',
    title: 'columns.name',
    type: 'text',
    sortable: true,
  },
  {
    field: 'description',
    title: 'columns.description',
    type: 'text',
    parseField: (value: string | null | undefined) =>
      value && value.trim() ? value : t('status.fallback.notSet', {}, 'projects'),
  },
  {
    field: 'isDefault',
    title: 'columns.default',
    type: 'text',
    parseField: (value: boolean) =>
      value ? t('status.default', {}, 'projects') : t('status.fallback.dash', {}, 'projects'),
  },
  {
    field: 'active',
    title: 'columns.active',
    type: 'text',
    parseField: (value: boolean) =>
      value ? t('status.active', {}, 'projects') : t('status.inactive', {}, 'projects'),
  },
];
