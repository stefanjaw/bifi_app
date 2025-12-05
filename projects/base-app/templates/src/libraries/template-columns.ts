import { template } from '@avalantec/base-app/interfaces';
import { tableColumn } from '@avalantec/base-app/resource';
import { Tag } from 'primeng/tag';

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
        component: Tag,
        inputs: {
          value: value.codeOriginal ? 'Code provided' : 'Code not provided',
          severity: value.codeOriginal ? 'success' : 'warn',
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
        component: Tag,
        inputs: {
          value: value.codeCustom ? 'Code provided' : 'Code not provided',
          severity: value.codeCustom ? 'success' : 'warn',
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
