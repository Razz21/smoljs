import { AnyFunction } from './types';
import { withoutNulls } from './utils/arrays';

export const DOM_TYPES = {
  TEXT: 'text',
  ELEMENT: 'element',
  FRAGMENT: 'fragment',
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

export type ElementVNodeProps = {
  class?: string | string[];
  style?: Record<string, string>;
  on?: Events;
};

export type ElementVNodeListeners = Record<string, AnyFunction>;

export type ElementVNode<Tag extends ElementTag> = {
  tag: Tag;
  type: typeof DOM_TYPES.ELEMENT;
  props: ElementVNodeProps;
  children?: VNode[];
  el?: Element;
  listeners?: ElementVNodeListeners;
};

export type VNode = TextVNode | FragmentVNode | ElementVNode<any>;

export function h<Tag extends ElementTag>(
  tag: Tag,
  props: ElementVNodeProps = {},
  children: ChildrenVNode[] = []
): ElementVNode<Tag> {
  return {
    tag,
    props,
    children: mapTextNodes(withoutNulls(children)),
    type: DOM_TYPES.ELEMENT,
  };
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

export function extractChildren(vdom: FragmentVNode | ElementVNode<any>): VNode[] {
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
