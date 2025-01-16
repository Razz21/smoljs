import type { Component, ComponentInstance } from '@/component';
import type { Attributes } from '@/components/types';
import type { WritableAttributes } from '@/types';
import { isClassComponent } from './constructors';
import { normalizeChildren, removeNullChildren } from './helpers';
import type { ElementVNodeListeners, Events } from './types';

export const TextVNode: unique symbol = Symbol.for('text');
export const FragmentVNode: unique symbol = Symbol.for('fragment');

export type VNodeTypes =
  | string
  | ComponentInstance
  | typeof TextVNode //
  | typeof FragmentVNode;

export interface VNode {
  _isVNode: true;
  type?: VNodeTypes;
  props: VNodeProps<any>;
  children: VNodeChildren[];
  el: Element | Text | null;
  ref: string | null;
  listeners: ElementVNodeListeners | null;
  component: Component<any, any> | null;
}

export type VNodeChildren = VNode | string | number | boolean | null | undefined | void;

export type VNodeProps<T> = {
  class?: string | string[];
  style?: WritableAttributes<CSSStyleDeclaration>;
  on?: Events;
} & Attributes &
  T;

export function createVNode(
  type: VNodeTypes,
  props?: VNodeProps<any> | null,
  children?: VNodeChildren[],
  shouldNormalize = true
): VNode {
  const { ref, ...rest } = props ?? {};
  let _children = removeNullChildren(children);

  if (shouldNormalize) {
    _children = normalizeChildren(_children);
  }
  return {
    _isVNode: true,
    type,
    props: rest,
    children: _children,
    el: null,
    ref: typeof ref === 'string' && ref.length > 0 ? ref : null,
    listeners: null,
    component: null,
  } satisfies VNode;
}

export function createTextVNode(value: string) {
  return createVNode(TextVNode, null, [value], false);
}

export function isVNode(value?: any): value is VNode {
  return value ? value?._isVNode === true : false;
}

export function isTextVNode(value?: unknown): value is typeof TextVNode {
  return isVNode(value) && value.type === TextVNode;
}

export function isFragmentVNode(value?: unknown): value is typeof FragmentVNode {
  return isVNode(value) && value.type === FragmentVNode;
}

export function isElementVNode(value?: unknown): value is VNode {
  return isVNode(value) && typeof value.type === 'string';
}

export function isClassComponentVNode(value?: unknown): value is VNode {
  return isVNode(value) && isClassComponent(value.type);
}
