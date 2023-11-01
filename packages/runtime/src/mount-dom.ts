import { setAttributes } from './attributes';
import { Component } from './component';
import { addEventListeners } from './events';
import { DOM_TYPES, ElementVNode, ElementVNodeProps, FragmentVNode, TextVNode, VNode } from './h';

export function mountDOM(vdom: VNode, parentEl: HTMLElement, index?: number, hostComponent?: Component) {
  switch (vdom.type) {
    case DOM_TYPES.TEXT: {
      createTextNode(vdom, parentEl, index);
      break;
    }
    case DOM_TYPES.ELEMENT: {
      createElementNode(vdom, parentEl, index, hostComponent);
      break;
    }
    case DOM_TYPES.FRAGMENT: {
      createFragmentNodes(vdom, parentEl, index, hostComponent);
      break;
    }
    default: {
      throw new Error(`Can'n mount DOM of type: ${(vdom as any).type}`);
    }
  }
}

function createTextNode(vdom: TextVNode, parentEl: HTMLElement, index?: number) {
  const { value } = vdom;
  const textNode = document.createTextNode(value);
  vdom.el = textNode;

  insert(textNode, parentEl, index);
}

function createElementNode(vdom: ElementVNode, parentEl: HTMLElement, index: number, hostComponent?: Component) {
  const { tag, props, children } = vdom;
  const element = document.createElement(tag);
  addProps(element, props, vdom, hostComponent);
  vdom.el = element;
  children.forEach((child) => mountDOM(child, element, null, hostComponent));
  insert(element, parentEl, index);
}

function addProps(el: HTMLElement, props: ElementVNodeProps, vdom: ElementVNode, hostComponent?: Component) {
  const { on: events, ...attrs } = props;

  vdom.listeners = addEventListeners(events, el, hostComponent);
  setAttributes(el, attrs as any);
}

function createFragmentNodes(vdom: FragmentVNode, parentEl: HTMLElement, index: number, hostComponent?: Component) {
  const { children } = vdom;
  vdom.el = parentEl;
  children.forEach((child, i) => mountDOM(child, parentEl, index ? index + i : null, hostComponent));
}

export function insert(el: Node, parentEl: HTMLElement, index?: any) {
  if (index == null) {
    parentEl.append(el);
    return;
  }
  if (index < 0) {
    throw new Error(`Index must be a positive intever, got ${index}`);
  }
  const children = parentEl.childNodes;
  if (index >= children.length) {
    parentEl.append(el);
  } else {
    parentEl.insertBefore(el, children[index]);
  }
}
