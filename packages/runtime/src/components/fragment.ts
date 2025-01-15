import type { ComponentContext } from '@/component';
import { hFragment } from '@/vdom';
import type { Attributes } from './types';

export function Fragment(_props: Attributes, { children }: ComponentContext) {
  return hFragment(children);
}
