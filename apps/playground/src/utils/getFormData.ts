import { mapValues } from './mapValues';

const mapEmptyStringsToNulls = (value: any) => (value === '' ? null : value);

export function getFormData<T = any>(form: HTMLFormElement) {
  const formData = new FormData(form);
  const formState = Object.fromEntries(formData.entries());

  return mapValues(formState, mapEmptyStringsToNulls) as T;
}
