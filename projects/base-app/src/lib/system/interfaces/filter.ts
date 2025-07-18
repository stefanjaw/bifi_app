import { deepKeys } from './deep-keys';

export interface filter<T extends Record<string, any> = Record<string, any>> {
  field: deepKeys<T>;
  value?: string;
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
    | 'not like';
  type?: 'string' | 'number' | 'date' | 'boolean';
}

export type filterOperator = 'and' | 'or' | 'not' | 'nor';
