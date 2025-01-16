import { setAttributes } from '@/attributes';
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

export function mountDOM(
  vdom: VNode,
  parentEl: Element,
  index?: number,
  hostComponent?: Component<unknown, unknown>
) {
  if (isClassComponentVNode(vdom)) {
    return createComponentNode(vdom, parentEl, index);
  } else if (isTextVNode(vdom)) {
    return createTextNode(vdom, parentEl, index);
  } else if (isFragmentVNode(vdom)) {
    return createFragmentNodes(vdom, parentEl, index, hostComponent);
  } else if (isElementVNode(vdom)) {
    return createElementNode(vdom, parentEl, index, hostComponent);
  }
  throw new Error(`Can'n mount DOM of type: ${(vdom as any).type}`);
}

// TODO check this value
function createTextNode(vdom: VNode, parentEl: Element, index?: number) {
  const { children } = vdom;
  const value = children.at(0);
  if (typeof value !== 'string') {
    console.error('Text node must be a string, got:', value);
    return;
  }
  const textNode = document.createTextNode(value);
  vdom.el = textNode;

  insert(textNode, parentEl, index);
}

function createElementNode<VDom extends VNode>(
  vdom: VDom,
  parentEl: Element,
  index: number,
  hostComponent?: Component<unknown, unknown>
) {
  const { type, children } = vdom;
  const element = document.createElement(type as string);
  addProps(element, vdom, hostComponent);
  vdom.el = element;
  children.forEach((child) => isVNode(child) && mountDOM(child, element, null, hostComponent));
  insert(element, parentEl, index);
}

function addProps(el: Element, vdom: VNode, hostComponent?: Component<unknown, unknown>) {
  const { on: events = {}, ...props } = vdom.props;
  const { key, ...attrs } = props;
  vdom.listeners = addEventListeners(events, el, hostComponent);
  setAttributes(el, attrs);
}

function createFragmentNodes(
  vdom: VNode,
  parentEl: Element,
  index: number,
  hostComponent?: Component<unknown, unknown>
) {
  const { children } = vdom;
  vdom.el = parentEl;
  children.forEach(
    (child, i) =>
      isVNode(child) && mountDOM(child, parentEl, index ? index + i : null, hostComponent)
  );
}

function createComponentNode(vdom: VNode, parentEl: Element, index: number) {
  const Component = vdom.type as ComponentInstance;
  const props = vdom.props;
  /*
   * propagate children to component JSX style
   */
  const component = new Component(props, vdom.children);

  component.mount(parentEl, index);
  vdom.component = component;
  vdom.el = component.firstElement;
}

export function insert(el: Node, parentEl: Element, index?: any) {
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
