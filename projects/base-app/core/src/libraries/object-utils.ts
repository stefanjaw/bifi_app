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
