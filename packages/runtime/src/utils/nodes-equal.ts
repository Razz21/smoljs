import { type VNode, isClassComponentVNode, isElementVNode } from '@/vdom';

export function areNodesEqual(nodeOne: VNode, nodeTwo: VNode): boolean {
  if (nodeOne.type !== nodeTwo.type) {
    return false;
  }

  if (isElementVNode(nodeOne) || isClassComponentVNode(nodeOne)) {
    const {
      type: typeOne,
      props: { key: keyOne },
    } = nodeOne;
    const {
      type: typeTwo,
      props: { key: keyTwo },
    } = nodeTwo as typeof nodeOne;
    // TODO: test performance of key comparison
    return typeOne === typeTwo && keyOne === keyTwo;
  }

  return true;
}
