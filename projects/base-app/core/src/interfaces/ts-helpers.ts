export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type IsPlainObject<T> = T extends object
  ? // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    T extends Function
    ? false
    : T extends Date
      ? false
      : T extends any[]
        ? false
        : T extends File
          ? false
          : true
  : false;
