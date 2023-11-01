export function objectsDiff<T extends Record<string, any>, U extends Record<string, any>>(
  oldObj: T = {} as T,
  newObj: U = {} as U
) {
  const oldKeys = Object.keys(oldObj);
  const newKeys = Object.keys(newObj);

  return {
    added: newKeys.filter((key) => !(key in oldObj)),
    removed: oldKeys.filter((key) => !(key in newObj)),
    updated: newKeys.filter((key) => key in oldObj && oldObj[key] !== newObj[key]),
  };
}

export function hasOwnProperty(obj: object, prop: PropertyKey) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
