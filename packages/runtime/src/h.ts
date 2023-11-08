import { Component, ComponentInstance, InferProps } from './component';
import { AnyFunction, WritableAttributes } from './types';
import { withoutNulls } from './utils/arrays';

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

export type ChildrenVNode = VNode | string;

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
  key?: string | number;
} & T;

export type ElementVNodeListeners = Record<string, AnyFunction>;

export type SelectHTMLAttributes<Tag extends ElementTag> = HTMLElementTagNameMap[Tag];

export type ElementVNode<Tag extends ElementTag = any> = {
  tag: Tag;
  type: typeof DOM_TYPES.ELEMENT;
  props: VNodeProps<WritableAttributes<Element>>;
  children?: VNode[];
  el?: Element;
  listeners?: ElementVNodeListeners;
};

export type ComponentVNode<TProps, TState> = {
  tag: ComponentInstance<TProps, TState, any>;
  type: typeof DOM_TYPES.COMPONENT;
  props: VNodeProps<TProps>;
  component?: Component<TProps, TState>;
  children?: VNode[];
  el?: Element;
};

export type VNode = TextVNode | FragmentVNode | ElementVNode | ComponentVNode<any, any>;

export function h<T extends ElementTag>(
  tag: T,
  props?: VNodeProps<WritableAttributes<HTMLElementTagNameMap[T]>> | null,
  children?: ChildrenVNode[] | null
): ElementVNode<ElementTag>;
export function h<T extends ComponentInstance<any, any, any>>(
  tag: T,
  props?: VNodeProps<InferProps<T>> | null,
  children?: ChildrenVNode[] | null
): ComponentVNode<any, any>;
export function h(tag: any, props = {}, children = []) {
  const type = typeof tag === 'string' ? DOM_TYPES.ELEMENT : DOM_TYPES.COMPONENT;
  return {
    tag,
    type,
    props: props ?? {},
    children: mapTextNodes(withoutNulls(children ?? [])),
  } as any;
}

export function mapTextNodes(children: ChildrenVNode[]): VNode[] {
  return children.map((child) => (typeof child === 'string' ? hString(child) : child));
}

export function hString(str: string): TextVNode {
  return {
    type: DOM_TYPES.TEXT,
    value: str,
  };
}

export function hFragment(vNodes: ChildrenVNode[]): FragmentVNode {
  return {
    type: DOM_TYPES.FRAGMENT,
    children: mapTextNodes(withoutNulls(vNodes)),
  };
}

export function extractChildren(vdom: FragmentVNode | ElementVNode): VNode[] {
  if (vdom.children == null) {
    return [];
  }
  const children: VNode[] = [];

  for (const child of vdom.children) {
    if (child.type === DOM_TYPES.FRAGMENT) {
      children.push(...extractChildren(child));
    } else {
      children.push(child);
    }
  }

  return children;
}
