import type { ComponentInstance, InferProps } from '@/component';
import type { FunctionComponent } from '@/components';
import type { WritableAttributes } from '@/types';
import {
  type Attributes,
  type ElementTag,
  FragmentVNode,
  type VNode,
  type VNodeChildren,
  type VNodeProps,
  createVNode,
  isClassComponent,
  isFunctionComponent,
} from '@/vdom';

export function h<P = {}>(
  type: FunctionComponent<P>,
  props?: (Attributes & P) | null,
  children?: VNodeChildren[] | null
): VNode;
export function h<T extends ElementTag>(
  type: T,
  props?: VNodeProps<WritableAttributes<HTMLElementTagNameMap[T]>> | null,
  children?: VNodeChildren[] | null
): VNode;
export function h<T extends ComponentInstance<any, any, any>>(
  type: T,
  props?: VNodeProps<InferProps<T>> | null,
  children?: VNodeChildren[] | null
): VNode;
export function h(type: any, props?: any, children?: VNodeChildren[] | null) {
  if (typeof type === 'string') {
    return createVNode(type, props, children);
  }
  if (isClassComponent(type)) {
    return createVNode(type, props, children);
  }
  if (isFunctionComponent(type)) {
    return type(props, { children }) as any;
  }
  throw new Error(`Unknown component tag type: ${type} (${typeof type})`);
}

export function hFragment(vNodes: VNodeChildren[]): VNode {
  return createVNode(FragmentVNode, null, vNodes);
}
