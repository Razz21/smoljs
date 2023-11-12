import { DOM_TYPES, type VNode } from '@/vdom';

export function areNodesEqual(nodeOne: VNode, nodeTwo: VNode): boolean {
  if (nodeOne.type !== nodeTwo.type) {
    return false;
  }
  if (nodeOne.type === DOM_TYPES.ELEMENT || nodeOne.type === DOM_TYPES.COMPONENT) {
    const {
      tag: tagOne,
      props: { key: keyOne },
    } = nodeOne;
    const {
      tag: tagTwo,
      props: { key: keyTwo },
    } = nodeTwo as typeof nodeOne;
    // FIXME: key comparison is extremely expensive
    return tagOne === tagTwo && keyOne === keyTwo;
  }

  return true;
}
