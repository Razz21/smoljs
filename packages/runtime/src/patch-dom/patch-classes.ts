import { calculateArrayDifference, isNonBlankString } from '@/utils';

export function patchClasses(
  el: Element,
  oldClass: string | string[],
  newClass: string | string[]
) {
  const oldClasses = toClassList(oldClass);
  const newClasses = toClassList(newClass);

  // Take all classes attached to the element
  const currentClasses = [...new Set([...el.classList, ...oldClasses])];

  const { added, removed } = calculateArrayDifference(currentClasses, newClasses);

  el.classList.remove(...removed);
  el.classList.add(...added);
}

function toClassList(classes: string | string[] = '') {
  return Array.isArray(classes)
    ? classes.filter(isNonBlankString)
    : classes.split(/\s+/).filter(isNonBlankString);
}
