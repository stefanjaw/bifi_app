import { pagination } from './pagination';

export type tableRows<T> = T[] | pagination<T> | undefined;
