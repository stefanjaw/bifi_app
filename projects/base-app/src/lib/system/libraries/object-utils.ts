import { pagination } from '../interfaces/pagination';

export const isPaginated = <T>(object: any): object is pagination<T> => {
  return 'docs' in object;
};

export const castTo = <T>(): ((object: any) => T) => {
  return (row) => row as T;
};
