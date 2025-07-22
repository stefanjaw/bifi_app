import { deepKeys } from '@avalantec/base-app/core';

export interface filter<T extends Record<string, any> = Record<string, any>> {
  field: deepKeys<T>;
  value?: string | boolean | number;
  operator?:
    | '=='
    | '!='
    | '>'
    | '<'
    | '>='
    | '<='
    | 'in'
    | 'not in'
    | 'like'
    | 'not like'
    | 'empty';
  type?: 'string' | 'number' | 'date' | 'boolean';
}

export interface filterGroup<T extends Record<string, any> = Record<string, any>> {
  filters: filter<T>[];
  operator: filterOperator;
}

export type filterOperator = 'and' | 'or' | 'not' | 'nor';
