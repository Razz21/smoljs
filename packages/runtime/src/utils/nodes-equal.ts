import { type VNode, isClassComponentVNode, isElementVNode } from '@/vdom';

export function areVNodeNodesEqual(nodeA: VNode, nodeB: VNode): boolean {
  if (nodeA.type !== nodeB.type) {
    return false;
  }

  if (isElementVNode(nodeA) || isClassComponentVNode(nodeA)) {
    const {
      type: typeA,
      props: { key: keyA },
    } = nodeA;
    const {
      type: typeB,
      props: { key: keyB },
    } = nodeB as typeof nodeA;

    // TODO: test performance of this approach
    return typeA === typeB && keyA === keyB;
  }

  return true;
}
