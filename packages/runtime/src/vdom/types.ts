import type { Component, ComponentInstance } from '@/component';
import type { Attributes } from '@/components/types';
import type { AnyFunction, WritableAttributes } from '@/types';

export const DOM_TYPES = {
  TEXT: 'text',
  ELEMENT: 'element',
  FRAGMENT: 'fragment',
  COMPONENT: 'component',
} as const;

export type ElementTag = keyof HTMLElementTagNameMap;

export type Events = {
  [K in keyof HTMLElementEventMap]?: (event?: HTMLElementEventMap[K]) => any;
};

export type ChildrenVNode = VNode | object | string | number | boolean | null | undefined | void;

export type TextVNode = {
  type: typeof DOM_TYPES.TEXT;
  value: string;
  el?: Text;
};

export type FragmentVNode = {
  type: typeof DOM_TYPES.FRAGMENT;
  children: VNode[];
  el?: Element;
};

export type VNodeProps<T> = {
  class?: string | string[];
  style?: WritableAttributes<CSSStyleDeclaration>;
  on?: Events;
} & Attributes &
  T;

export type ElementVNodeListeners = Record<string, AnyFunction>;

export type SelectHTMLAttributes<Tag extends ElementTag> = HTMLElementTagNameMap[Tag];

export type ElementVNode<Tag extends ElementTag = any> = {
  tag: Tag;
  type: typeof DOM_TYPES.ELEMENT;
  props: VNodeProps<WritableAttributes<Element>>;
  children?: VNode[];
  el?: Element;
  listeners?: ElementVNodeListeners;
  ref?: string;
};

export type ComponentVNode<TProps, TState> = {
  tag: ComponentInstance<TProps, TState, any>;
  type: typeof DOM_TYPES.COMPONENT;
  props: VNodeProps<TProps>;
  component?: Component<TProps, TState>;
  children?: VNode[];
  el?: Element;
};

export type VNode = TextVNode | FragmentVNode | ElementVNode | ComponentVNode<any, any> | null;
