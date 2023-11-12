import { hString } from '../constructors';
import { ChildrenVNode, VNode } from '../types';

export function mapTextNodes(children: ChildrenVNode[]): VNode[] {
  return children.map((child) => (typeof child === 'string' ? hString(child) : child));
}
