type join<K, P> = K extends string ? (P extends string | number ? `${K}.${P}` : never) : never;

type prev = [never, 0, 1, 2, 3, 4, 5, ...0[]];

export type deepKeys<T, D extends number = 4> = [D] extends [never]
  ? never
  : T extends object
    ? {
        [K in keyof T & string]: T[K] extends (infer U)[]
          ? K | join<K, deepKeys<U, prev[D]>>
          : T[K] extends object
            ? K | join<K, deepKeys<T[K], prev[D]>>
            : K;
      }[keyof T & string]
    : never;
