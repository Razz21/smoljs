import { type VNode, isFragmentVNode } from '@/vdom';

export function extractChildNodes(vnode: VNode): VNode[] {
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
