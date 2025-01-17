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

type ElementProps<T extends ElementTag> = WritableAttributes<HTMLElementTagNameMap[T]>;
type InferComponentProps<T> = T extends ComponentInstance
  ? InferProps<T>
  : T extends FunctionComponent<any>
    ? Parameters<T>[0]
    : never;

export function h<T>(
  type: T,
  props?: (Attributes & InferComponentProps<T>) | null,
  children?: VNodeChildren[] | null
): VNode;
export function h<T extends ElementTag>(
  type: T,
  props?: VNodeProps<ElementProps<T>> | null,
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

  throw new Error(
    `Invalid component type passed to "h": expected a string, class component, or function component but received ${typeof type} (${type}).`
  );
}

export function hFragment(vNodes: VNodeChildren[]): VNode {
  return createVNode(FragmentVNode, null, vNodes);
}
