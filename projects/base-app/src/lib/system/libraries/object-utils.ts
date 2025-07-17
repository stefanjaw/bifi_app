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

/**
 * Returns a function that casts any given object to type `T`.
 * Use this as a `map` function to cast an array of objects to type `T`.
 * @example
 * const someArray: any[] = [...];
 * const castedArray = someArray.map(castTo<MyType>());
 * @returns {(object: any) => T}
 */
export const castTo = <T>(): ((object: any) => T) => {
  return (row) => row as T;
};
