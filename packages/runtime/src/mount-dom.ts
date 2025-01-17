import { applyAttributes } from '@/attributes';
import type { Component, ComponentInstance } from '@/component';
import { addEventListeners } from '@/events';
import {
  type VNode,
  isClassComponentVNode,
  isElementVNode,
  isFragmentVNode,
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
  const { children } = vnode;
  const textContent = children.at(0);
  if (typeof textContent !== 'string') {
    console.error('Expected a string for text node, received:', textContent);
    return;
  }
  const textNode = document.createTextNode(textContent);
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
    if (isVNode(child)) {
      mountVNode(child, element, null, hostComponent);
    }
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
    if (isVNode(child)) {
      mountVNode(child, parentElement, index ? index + i : null, hostComponent);
    }
  });
}

/**
 * Mounts a class component VNode to the DOM.
 */
function mountComponentVNode(
  vnode: VNode,
  parentElement: Element,
  index?: number
): void {
  const ComponentClass = vnode.type as ComponentInstance;
  const props = vnode.props;

  // Initialize and mount the component.
  const component = new ComponentClass(props, vnode.children);
  component.mount(parentElement, index);

  vnode.component = component;
  vnode.el = component.firstElement;
}

/**
 * Inserts a node into the parent element at the specified index.
 */
export function insertNode(node: Node, parentElement: Element, index?: number): void {
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
