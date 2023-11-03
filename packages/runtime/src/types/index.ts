export type Nullable<T> = T | null | undefined;

export type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

export type AnyFunction = (...args: any) => any;

export type OmitByValue<T, U> = {
  [K in keyof T]: T[K] extends U ? never : K;
}[keyof T];

export type OmitByValues<T, U> = Pick<T, OmitByValue<T, U>>;

type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? A : B;

export type WritableKeys<T> = {
  [P in keyof T]-?: IfEquals<{ [Q in P]: T[P] }, { -readonly [Q in P]: T[P] }, P>;
}[keyof T];

type FunctionAttributes<T> = OmitByValue<T, AnyFunction>;
type OmitEventHandlers<T> = Exclude<T, `on${string}` | 'on'>;

export type WritableAttributes<T> = Partial<Pick<T, OmitEventHandlers<WritableKeys<T> & FunctionAttributes<T>>>>;
