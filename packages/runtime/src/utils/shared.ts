import { FragmentVNode, type VNode } from '@/vdom';

export const isPrototypeOf = Function.call.bind(Object.prototype.isPrototypeOf);

export function extractChildren(vdom: VNode): VNode[] {
  if (vdom.children == null) {
    return [];
  }
  const children: VNode[] = [];

  for (const child of vdom.children) {
    if (child.type === FragmentVNode) {
      children.push(...extractChildren(child));
    } else {
      children.push(child);
    }
  }

  return children;
}
