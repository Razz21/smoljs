import { Component, type ComponentInstance } from '@/component';
import type { FunctionComponent } from '@/components/types';
import type { WritableAttributes } from '@/types';
import { filterNonNullable, isPrototypeOf } from '@/utils';
import { normalizeChildren } from './helpers';
import type { Attributes, ElementVNodeListeners, Events } from './types';

export const TextVNode: unique symbol = Symbol.for('text');
export const FragmentVNode: unique symbol = Symbol.for('fragment');

export type VNodeTypes = string | ComponentInstance | typeof TextVNode | typeof FragmentVNode;

export interface VNode {
  _isVNode: true;
  type: VNodeTypes;
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
  const { ref: rawRef, ...others } = props ?? {};
  let _children = filterNonNullable(children || []);

  if (shouldNormalize) {
    _children = normalizeChildren(_children);
  }
  const ref = typeof rawRef === 'string' ? rawRef : null;
  return {
    _isVNode: true,
    type,
    props: others,
    children: _children,
    ref,
    el: null,
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

export function isTextVNode(value?: unknown): boolean {
  return isVNode(value) && value.type === TextVNode;
}

export function isFragmentVNode(value?: unknown): boolean {
  return isVNode(value) && value.type === FragmentVNode;
}

export function isElementVNode(value?: unknown): boolean {
  return isVNode(value) && typeof value.type === 'string';
}

export function isClassComponentVNode(value?: unknown): boolean {
  return isVNode(value) && isClassComponent(value.type);
}

export function isClassComponent(type: unknown): type is ComponentInstance<any, any, any> {
  return isFunctionComponent(type) && isPrototypeOf(Component, type);
}

export function isFunctionComponent(type: unknown): type is FunctionComponent<any> {
  return typeof type === 'function';
}
