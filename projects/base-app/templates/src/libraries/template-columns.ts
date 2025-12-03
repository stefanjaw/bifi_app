import { template } from '@avalantec/base-app/interfaces';
import { tableColumn } from '@avalantec/base-app/resource';

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
    sortable: true,
    parseField(value: string) {
      return value?.substring(0, 200) + '…';
    },
  },
  {
    field: 'codeCustom',
    title: 'Custom Code',
    type: 'text',
    sortable: true,
    parseField(value: string) {
      return value?.substring(0, 200) + '…';
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
