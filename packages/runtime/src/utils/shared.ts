import { DOM_TYPES, type ElementVNode, type VNode } from '@/vdom';

type VNodeWithChildren = Pick<ElementVNode, 'children'> & {
  type: (typeof DOM_TYPES)[keyof typeof DOM_TYPES];
};

export const isPrototypeOf = Function.call.bind(Object.prototype.isPrototypeOf);

export function extractChildren<TVNode extends VNodeWithChildren>(vdom: TVNode): VNode[] {
  if (vdom.children == null) {
    return [];
  }
  const children: VNode[] = [];

  for (const child of vdom.children) {
    if (child.type === DOM_TYPES.FRAGMENT) {
      children.push(...extractChildren(child));
    } else {
      children.push(child);
    }
  }

  return children;
}
