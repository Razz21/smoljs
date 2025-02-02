import type { Component, ComponentInstance } from '@/component';
import type { FunctionComponent } from '@/components';
import type { AnyFunction, WritableAttributes } from '@/types';

export type ElementTag = keyof HTMLElementTagNameMap;

export type Events = {
  [K in keyof HTMLElementEventMap]?: (event?: HTMLElementEventMap[K]) => any;
};

export type ElementVNodeListeners = Record<string, AnyFunction>;

export type SelectHTMLAttributes<Tag extends ElementTag> = HTMLElementTagNameMap[Tag];

export type Key = any;
export type Attributes = {
  key?: Key;
};

export const TextVNodeType: unique symbol = Symbol.for('text');
export const FragmentVNodeType: unique symbol = Symbol.for('fragment');

export type VNodeTypes =
  | string
  | ComponentInstance
  | typeof TextVNodeType
  | typeof FragmentVNodeType
  | FunctionComponent<any>;

interface BaseVNode {
  _isVNode: true;
  type: VNodeTypes;
  props: VNodeProps<any>;
  children: VNode[];
  el: any | null;
  ref: string | null;
  listeners: ElementVNodeListeners | null;
  component: any | null;
}

export interface TextVNode extends BaseVNode {
  type: typeof TextVNodeType;
  props: { nodeValue: string };
  el: Text | null;
  component: null;
}
export interface FragmentVNode extends BaseVNode {
  type: typeof FragmentVNodeType;
  component: null;
}
export interface ElementVNode extends BaseVNode {
  type: string;
  el: Element | null;
  listeners: null;
  component: null;
}

export interface ComponentVNode extends BaseVNode {
  type: ComponentInstance;
  component: Component<any, any> | null;
}

export interface FunctionComponentVNode extends BaseVNode {
  type: FunctionComponent<any>;
  props: VNodeProps<any>;
  children: VNode[];
  ref: string | null;
}

export type VNode =
  | TextVNode
  | FragmentVNode
  | ElementVNode
  | ComponentVNode
  | FunctionComponentVNode;

export type VNodeChildren = VNode | string | number | boolean | null | undefined | void;

export type VNodeProps<T> = {
  class?: string | string[];
  style?: WritableAttributes<CSSStyleDeclaration>;
  on?: Events;
  ref?: string;
} & Attributes &
  T;
