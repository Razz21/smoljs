import { hString } from '../constructors';
import { type ChildrenVNode, DOM_TYPES, type VNode } from '../types';

export function mapTextNodes(children: ChildrenVNode[]): VNode[] {
  return children.map((child) => (isVNode(child) ? child : hString(String(child))));
}

const vNodeTypes = Object.values(DOM_TYPES);

function isVNode(child: ChildrenVNode): child is VNode {
  return typeof child === 'object' && 'type' in child && vNodeTypes.includes(child.type);
}
