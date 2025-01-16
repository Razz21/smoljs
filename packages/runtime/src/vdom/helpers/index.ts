import { withoutNulls } from '@/utils';
import { type VNode, type VNodeChildren, createTextVNode, isVNode } from '../VNode';

export function normalizeChildren(children: VNodeChildren[]): VNode[] {
  return children.map((child) => (isVNode(child) ? child : createTextVNode(String(child))));
}

export function removeNullChildren(children?: VNodeChildren[]): VNodeChildren[] {
  if (!children) return [];

  return withoutNulls(children);
}
