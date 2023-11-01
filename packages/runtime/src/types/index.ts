export type Nullable<T> = T | null | undefined;
export type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];
export type AnyFunction = (...args: any) => any;
