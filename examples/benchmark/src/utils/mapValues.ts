export function mapValues<T extends object, R>(obj: T, iteratee: (value: any, key: string) => R): { [K in keyof T]: R } {
  const keys = Object.keys(obj) as (keyof T & string)[];
  const result = keys.reduce((acc, key) => {
    acc[key] = iteratee(obj[key], key);
    return acc;
  }, {} as { [K in keyof T]: R });
  return result;
}
