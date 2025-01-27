import { applyAttribute, removeAttribute } from '@/attributes';
import { objectsDiff } from '@/utils';

export function patchAttrs(
  el: Element,
  oldAttrs: Record<string, any>,
  newAttrs: Record<string, any>
) {
  const { added, removed, updated } = objectsDiff(oldAttrs, newAttrs);

  removed.forEach((attr) => removeAttribute(el, attr));
  [...added, ...updated].forEach((attr) => applyAttribute(el, attr, newAttrs[attr]));
}
