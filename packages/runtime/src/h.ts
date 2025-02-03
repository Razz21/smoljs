import type { ComponentInstance, InferProps } from '@/component';
import type { FunctionComponent } from '@/components';
import type { WritableAttributes } from '@/types';
import {
  type Attributes,
  type ElementTag,
  type VNode,
  type VNodeChildren,
  type VNodeProps,
  createFragmentVNode,
  createVNode,
  isFunctionComponent,
} from '@/vdom';

export type ElementProps<T extends ElementTag> = WritableAttributes<HTMLElementTagNameMap[T]>;
export type InferComponentProps<T> = T extends ComponentInstance
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
  if (!(typeof type === 'string' || typeof type === 'function')) {
    throw new Error(
      `Invalid component type passed to "h": expected a string, class component, or function component but received ${typeof type} (${type}).`
    );
  }
  return createVNode(type, props, children);
}

export const hFragment = createFragmentVNode;
