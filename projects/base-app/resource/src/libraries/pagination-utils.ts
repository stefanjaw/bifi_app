import { pagination } from '../interfaces/pagination';

/**
 * Checks if an object is a `pagination` object.
 * This is a helper function that is particularly useful for typeguards.
 * @example
 * const someObject: any = {...};
 * if (isPaginated(someObject)) {
 *   // code that knows someObject is a pagination object
 * }
 * @returns {object is pagination<T>}
 */
export const isPaginated = <T>(object: any): object is pagination<T> => {
  return 'docs' in object;
};
