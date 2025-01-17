export function isNonEmptyString(value: string): boolean {
  return value !== '';
}

export function isNonBlankString(value: string): boolean {
  return isNonEmptyString(value.trim());
}