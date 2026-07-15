import { t } from '@avalantec/base-app/i18n';
import { template } from '@avalantec/base-app/interfaces';
import { tableColumn } from '@avalantec/base-app/resource';
import { Tag } from 'primeng/tag';

export const templateColumns: tableColumn<template>[] = [
  {
    field: 'name',
    title: 'template',
    type: 'text',
    sortable: true,
  },
  {
    field: 'codeOriginal',
    title: 'originalCode',
    type: 'text',
    component: (value: template) => {
      return {
        component: Tag,
        inputs: {
          value: value.codeOriginal
            ? t('status.codeProvided', {}, 'base-app/templates')
            : t('status.codeNotProvided', {}, 'base-app/templates'),
          severity: value.codeOriginal ? 'success' : 'warn',
        },
      };
    },
  },
  {
    field: 'codeCustom',
    title: 'customCode',
    type: 'text',
    component: (value: template) => {
      return {
        component: Tag,
        inputs: {
          value: value.codeCustom
            ? t('status.codeProvided', {}, 'base-app/templates')
            : t('status.codeNotProvided', {}, 'base-app/templates'),
          severity: value.codeCustom ? 'success' : 'warn',
        },
      };
    },
  },
  {
    field: 'directory',
    title: 'directory',
    type: 'text',
    sortable: true,
  },
  {
    field: 'filename',
    title: 'filename',
    type: 'text',
    sortable: true,
  },
];
