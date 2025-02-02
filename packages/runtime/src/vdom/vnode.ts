import { Component } from '@/component';
import { normalizeChildren } from './helpers';
import {
  type ComponentVNode,
  type ElementVNode,
  type FragmentVNode,
  FragmentVNodeType,
  type FunctionComponentVNode,
  type TextVNode,
  TextVNodeType,
  type VNode,
  type VNodeChildren,
  type VNodeProps,
  type VNodeTypes,
} from './types';

export function createVNode(
  type: VNodeTypes,
  props?: VNodeProps<any> | null,
  children?: VNodeChildren[]
): VNode {
  const { ref: rawRef, ...others } = props ?? {};

  const normalizedChildren = normalizeChildren(children || []);
  const ref = typeof rawRef === 'string' ? rawRef : null;
  return {
    _isVNode: true,
    type,
    props: others,
    children: normalizedChildren,
    ref,
    el: null,
    listeners: null,
    component: null,
  } satisfies VNode;
}

export function createTextVNode(value: string) {
  return createVNode(TextVNodeType, { nodeValue: value });
}
export function createFragmentVNode(children: VNodeChildren[]): VNode {
  return createVNode(FragmentVNodeType, null, children);
}

export function isVNode(value?: any): value is VNode {
  return value ? value?._isVNode === true : false;
}

export function isTextVNode(value?: VNode): value is TextVNode {
  return value.type === TextVNodeType;
}

export function isFragmentVNode(value?: VNode): value is FragmentVNode {
  return value.type === FragmentVNodeType;
}

export function isElementVNode(value?: VNode): value is ElementVNode {
  return typeof value.type === 'string';
}

export function isClassComponentVNode(value?: VNode): value is ComponentVNode {
  return (
    isFunctionComponentVNode(value) && Object.prototype.isPrototypeOf.call(Component, value.type)
  );
}

export function isFunctionComponentVNode(value?: VNode): value is FunctionComponentVNode {
  return typeof value.type === 'function';
}
