export function isNonBlankString(value: string): boolean {
  return value.trim() !== '';
}

export function kebabize(str: string) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
