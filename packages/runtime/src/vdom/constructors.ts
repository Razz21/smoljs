import { isPrototypeOf, withoutNulls } from '@/utils';
import { Component, type ComponentInstance, type InferProps } from '@/component';
import type { Attributes, FunctionComponent } from '@/components';
import type { WritableAttributes } from '@/types';
import { mapTextNodes } from './helpers';
import {
  DOM_TYPES,
  type ChildrenVNode,
  type ComponentVNode,
  type ElementTag,
  type ElementVNode,
  type FragmentVNode,
  type TextVNode,
  type VNode,
  type VNodeProps,
} from './types';

export function h<P = {}>(
  tag: FunctionComponent<P>,
  props?: (Attributes & P) | null,
  children?: ChildrenVNode[] | null
): VNode;
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
export function h(tag: any, props: any, children = []) {
  props = props ?? {};

  if (!Array.isArray(children)) {
    children = [children];
  }

  // Flatten children's array, for nested or for-loop-generated elements
  children = children.flat(1);

  if (typeof tag === 'string') {
    return createElementVNode(tag, props, children) as any;
  }
  if (isClassComponent(tag)) {
    return createComponentVNode(tag, props, children) as any;
  }
  if (isFunctionComponent(tag)) {
    return tag(props, { children }) as any;
  }
  throw new Error(`Unknown component tag type: ${tag} (${typeof tag})`);
}

function isClassComponent(tag: unknown): tag is ComponentInstance<any, any, any> {
  return typeof tag === 'function' && isPrototypeOf(Component, tag);
}

function isFunctionComponent(tag: unknown): tag is FunctionComponent<any> {
  return typeof tag === 'function';
}

function createElementVNode(
  tag: string,
  props: VNodeProps<any>,
  children: ChildrenVNode[]
): ElementVNode {
  const { ref, ...rest } = props ?? {};
  return {
    tag,
    type: DOM_TYPES.ELEMENT,
    props: rest,
    children: mapTextNodes(withoutNulls(children)),
    el: null,
    listeners: null,
    ref,
  };
}
function createComponentVNode(
  tag: ComponentInstance<any, any, any>,
  props: VNodeProps<any>,
  children: ChildrenVNode[]
): ComponentVNode<any, any> {
  return {
    tag,
    type: DOM_TYPES.COMPONENT,
    props: props ?? {},
    children: mapTextNodes(withoutNulls(children)),
    component: null,
    el: null,
  };
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
