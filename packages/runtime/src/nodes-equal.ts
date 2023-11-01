import { DOM_TYPES, VNode } from './h';

export function areNodesEqual(nodeOne: VNode, nodeTwo: VNode): boolean {
  if (nodeOne.type !== nodeTwo.type) {
    return false;
  }
  if (nodeOne.type === DOM_TYPES.ELEMENT && nodeTwo.type === DOM_TYPES.ELEMENT) {
    const { tag: tagOne } = nodeOne;
    const { tag: tagTwo } = nodeTwo;
    return tagOne === tagTwo;
  }
  return true;
}
