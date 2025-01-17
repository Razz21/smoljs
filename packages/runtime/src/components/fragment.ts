import type { ComponentContext } from '@/component';
import { hFragment } from '@/h';
import type { Attributes } from '@/vdom';

export function Fragment(_props: Attributes, { children }: ComponentContext) {
  return hFragment(children);
}
