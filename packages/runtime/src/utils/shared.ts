import { type VNode, isFragmentVNode, isTextVNode, isVNode } from '@/vdom';

export const isPrototypeOf = Function.call.bind(Object.prototype.isPrototypeOf);

export function extractChildren(vdom: VNode): VNode[] {
  if (vdom.children == null || isTextVNode(vdom)) {
    return [];
  }
  const children: Array<VNode> = [];

  for (const child of vdom.children) {
    if (isFragmentVNode(child)) {
      children.push(...extractChildren(child as VNode));
    } else if (isVNode(child)) {
      children.push(child);
    }
  }

  return children;
}
