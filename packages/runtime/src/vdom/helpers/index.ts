import { filterNonNullable } from '@/utils';
import type { VNode, VNodeChildren } from '../types';
import { createTextVNode, isVNode } from '../vnode';

export function toVNode(children: VNodeChildren[]): VNode[] {
  return children.map((child) => (isVNode(child) ? child : createTextVNode(String(child))));
}

export function normalizeChildren(children: VNodeChildren | VNodeChildren[]): VNode[] {
  if (!Array.isArray(children)) {
    children = [children];
  }
  return toVNode(filterNonNullable(children));
}
