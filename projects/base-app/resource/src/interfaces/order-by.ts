import { deepKeys } from '@avalantec/base-app/core';

export type orderDirection = 'asc' | 'desc' | '';

export interface orderedField<T> {
  field: deepKeys<T>;
  order: orderDirection;
}

export type orderByQuery<T> = orderedField<T>[];

/**
 * {
 *  orderBy:
 * [
 *   {
 *     field: 'name',
 *     order: 'asc'
 *   }
 * ]
 * }
 */
