import { type VNode, isFragmentVNode, isTextVNode } from '@/vdom';

export const isPrototypeOf = Function.call.bind(Object.prototype.isPrototypeOf);

export function extractChildNodes(vnode: VNode): VNode[] {
  if (!vnode.children || isTextVNode(vnode)) {
    return [];
  }

  const extractedChildren: VNode[] = [];

  for (const child of vnode.children) {
    if (isFragmentVNode(child)) {
      extractedChildren.push(...extractChildNodes(child));
    } else {
      extractedChildren.push(child);
    }
  }

  return extractedChildren;
}
