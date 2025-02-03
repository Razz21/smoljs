import type { VNode } from '@/vdom';

export function areVNodeNodesEqual(nodeA: VNode, nodeB: VNode): boolean {
  if (nodeA.type !== nodeB.type) {
    return false;
  }

  return nodeA.props.key === nodeB.props.key;
}
