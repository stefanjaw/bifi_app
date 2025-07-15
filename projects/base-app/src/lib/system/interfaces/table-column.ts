import { TemplateRef } from '@angular/core';

export interface tableColumn<
  T extends Record<string, any> = Record<string, any>,
> {
  field: deepKeys<T>;
  parseField?: (value: T) => string;
  title: string;
  type: 'text' | 'number' | 'date' | 'image' | 'currency';
  template?: TemplateRef<any>;
  currencySymbol?: string;
}

// Recursivamente convierte claves anidadas a "a", "a.b", "a.b.c", etc.
type join<K, P> = K extends string
  ? P extends string | number
    ? `${K}.${P}`
    : never
  : never;

type prev = [never, 0, 1, 2, 3, 4, 5, ...0[]];

type deepKeys<T, D extends number = 4> = [D] extends [never]
  ? never
  : T extends object
    ? {
        [K in keyof T & string]: T[K] extends object
          ? K | join<K, deepKeys<T[K], prev[D]>>
          : K;
      }[keyof T & string]
    : never;
