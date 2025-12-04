import { template } from '@avalantec/base-app/interfaces';
import { tableColumn } from '@avalantec/base-app/resource';
import { Badge } from '@avalantec/base-app/ui';

export const templateColumns: tableColumn<template>[] = [
  {
    field: 'name',
    title: 'Template',
    type: 'text',
    sortable: true,
  },
  {
    field: 'codeOriginal',
    title: 'Original Code',
    type: 'text',
    component: (value: template) => {
      return {
        component: Badge,
        inputs: {
          text: value.codeOriginal ? 'Code provided' : 'Code not provided',
          variant: value.codeOriginal ? 'success' : 'error',
        },
      };
    },
  },
  {
    field: 'codeCustom',
    title: 'Custom Code',
    type: 'text',
    component: (value: template) => {
      return {
        component: Badge,
        inputs: {
          text: value.codeCustom ? 'Code provided' : 'Code not provided',
          variant: value.codeCustom ? 'success' : 'warning',
        },
      };
    },
  },
  {
    field: 'directory',
    title: 'Directory',
    type: 'text',
    sortable: true,
  },
  {
    field: 'filename',
    title: 'Filename',
    type: 'text',
    sortable: true,
  },
];
