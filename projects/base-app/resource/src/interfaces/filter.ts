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
  id?: string; // id of the group to add or remove
  filters: (filter<T> | filterGroup<T>)[];
  operator: filterOperator;
}

export type filterOperator = 'and' | 'or' | 'not' | 'nor';

/**
 * Describes a filterable field for use in the FilterBar UI component.
 * Provides a human-readable label and the field's data type so the bar
 * can render the correct operator list and value input.
 */
export interface filterFieldConfig<T extends Record<string, any> = Record<string, any>> {
  field: deepKeys<T>;
  label: string;
  type: 'string' | 'number' | 'date' | 'boolean';
}
