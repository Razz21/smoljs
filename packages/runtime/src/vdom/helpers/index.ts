import { filterNonNullable } from '@/utils';
import { type VNode, type VNodeChildren, createTextVNode, isVNode } from '../VNode';

export function normalizeChildren(children: VNodeChildren[]): VNode[] {
  return children.map((child) => (isVNode(child) ? child : createTextVNode(String(child))));
}

export function filterChildren(children: VNodeChildren | VNodeChildren[]): VNodeChildren[] {
  if (!Array.isArray(children)) {
    children = [children];
  }
  return filterNonNullable(children);
}
