import { template } from '@avalantec/base-app/interfaces';
import { filter } from '@avalantec/base-app/resource';

export const templateFilters: filter<template>[] = [
  {
    field: 'name',
    type: 'string',
  },
  {
    field: 'codeOriginal',
    type: 'string',
  },
  {
    field: 'codeCustom',
    type: 'string',
  },
  {
    field: 'directory',
    type: 'string',
  },
  {
    field: 'filename',
    type: 'string',
  },
  {
    field: 'mimeType',
    type: 'string',
  },
];
