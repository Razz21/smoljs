import { applyStyle, removeStyle } from '@/attributes';
import { objectsDiff } from '@/utils';

export function patchStyles(
  el: Element,
  oldStyle: Record<string, string>,
  newStyle: Record<string, string>
) {
  const { added, removed, updated } = objectsDiff(oldStyle, newStyle);

  removed.forEach((style) => removeStyle(el, style));
  [...added, ...updated].forEach((style) => applyStyle(el, style, newStyle[style]));
}
