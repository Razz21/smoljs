import { applyAttributes } from '@/attributes';
import type { Component, ComponentInstance } from '@/component';
import { addEventListeners } from '@/events';
import {
  type FunctionComponentVNode,
  type VNode,
  isClassComponentVNode,
  isElementVNode,
  isFragmentVNode,
  isFunctionComponentVNode,
  isTextVNode,
  isVNode,
} from '@/vdom';

/**
 * Mounts a VNode onto the DOM.
 */
export function mountVNode(
  vnode: VNode,
  parentElement: Element,
  index?: number,
  hostComponent?: Component<unknown, unknown>
): void {
  if (isClassComponentVNode(vnode)) {
    mountComponentVNode(vnode, parentElement, index);
  } else if (isFunctionComponentVNode(vnode)) {
    mountFunctionComponentVNode(vnode, parentElement, index, hostComponent);
  } else if (isTextVNode(vnode)) {
    mountTextVNode(vnode, parentElement, index);
  } else if (isFragmentVNode(vnode)) {
    mountFragmentVNode(vnode, parentElement, index, hostComponent);
  } else if (isElementVNode(vnode)) {
    mountElementVNode(vnode, parentElement, index, hostComponent);
  } else {
    throw new Error(`Cannot mount unknown VNode type: ${(vnode as any).type}`);
  }
}

/**
 * Mounts a text VNode to the DOM.
 */
function mountTextVNode(vnode: VNode, parentElement: Element, index?: number): void {
  const { props } = vnode;
  const textNode = document.createTextNode(props.nodeValue);
  vnode.el = textNode;

  insertNode(textNode, parentElement, index);
}

/**
 * Mounts an element VNode to the DOM.
 */
function mountElementVNode(
  vnode: VNode,
  parentElement: Element,
  index?: number,
  hostComponent?: Component<unknown, unknown>
): void {
  const { type, children } = vnode;
  const element = document.createElement(type as string);
  vnode.el = element;

  applyVNodeProps(element, vnode, hostComponent);

  children.forEach((child) => {
    mountVNode(child, element, null, hostComponent);
  });

  insertNode(element, parentElement, index);
}

/**
 * Applies props and attributes to an element.
 */
function applyVNodeProps(
  element: Element,
  vnode: VNode,
  hostComponent?: Component<unknown, unknown>
): void {
  const { on: eventListeners = {}, ...props } = vnode.props;
  const { key, ...attributes } = props;

  vnode.listeners = addEventListeners(eventListeners, element, hostComponent);
  applyAttributes(element, attributes);
}

/**
 * Mounts a fragment VNode to the DOM.
 */
function mountFragmentVNode(
  vnode: VNode,
  parentElement: Element,
  index?: number,
  hostComponent?: Component<unknown, unknown>
): void {
  const { children } = vnode;
  vnode.el = parentElement;

  children.forEach((child, i) => {
    mountVNode(child, parentElement, index ? index + i : null, hostComponent);
  });
}

/**
 * Mounts a class component VNode to the DOM.
 */
function mountComponentVNode(vnode: VNode, parentElement: Element, index?: number): void {
  const ComponentClass = vnode.type as ComponentInstance;
  const props = vnode.props;

  // TODO pass children/slot content
  // props['children'] = vnode.children;
  // Initialize and mount the component.
  const component = new ComponentClass(props, vnode.children);
  component.mount(parentElement, index);

  vnode.component = component;
  vnode.el = component.firstElement;
}

/**
 * Mounts a function component VNode to the DOM.
 */
function mountFunctionComponentVNode(
  vnode: FunctionComponentVNode,
  parentElement: Element,
  index?: number,
  hostComponent?: Component<unknown, unknown>
): void {
  const functionComponent = vnode.type;
  const { props, children } = vnode;

  const result = functionComponent(props, { children });

  if (!isVNode(result)) {
    console.warn(`Function component extected to return a VNode, received: ${result}`);
    return;
  }

  vnode.component = result;
  vnode.el = result.el;
  mountVNode(result, parentElement, index, hostComponent);
}

/**
 * Inserts a node into the parent element at the specified index.
 */
function insertNode(node: Node, parentElement: Element, index?: number): void {
  if (index == null) {
    parentElement.append(node);
    return;
  }
  if (index < 0) {
    throw new Error(`Index must be a non-negative integer, got ${index}`);
  }
  const children = parentElement.childNodes;
  if (index >= children.length) {
    parentElement.append(node);
  } else {
    parentElement.insertBefore(node, children[index]);
  }
}
