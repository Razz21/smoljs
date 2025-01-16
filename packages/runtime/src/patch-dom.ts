import { removeAttribute, removeStyle, setAttribute, setStyle } from '@/attributes';
import type { Component } from '@/component';
import { destroyDOM } from '@/destroy-dom';
import { addEventListener } from '@/events';
import { mountDOM } from '@/mount-dom';
import {
  ARRAY_DIFF_OP,
  areNodesEqual,
  arraysDiff,
  arraysDiffSequence,
  extractChildren,
  isNotBlankOrEmptyString,
  objectsDiff,
} from '@/utils';
import { type VNode, isClassComponentVNode, isElementVNode, isTextVNode } from '@/vdom';

export function patchDOM(
  oldVdom: VNode,
  newVdom: VNode,
  parentEl: Element,
  hostComponent?: Component<unknown, unknown>
) {
  if (!areNodesEqual(oldVdom, newVdom)) {
    const index = Array.from(parentEl.childNodes).indexOf(oldVdom.el);
    destroyDOM(oldVdom);
    mountDOM(newVdom, parentEl, index, hostComponent);
    return newVdom;
  }
  newVdom.el = oldVdom.el;

  if (isTextVNode(newVdom)) {
    patchText(oldVdom, newVdom);
    return newVdom;
  }
  if (isElementVNode(newVdom)) {
    patchElement(oldVdom, newVdom, hostComponent);
  }
  if (isClassComponentVNode(newVdom)) {
    patchComponent(oldVdom, newVdom);
    // TODO test, if children should be patched
    return newVdom;
  }

  patchChildren(oldVdom, newVdom, hostComponent);

  return newVdom;
}

function patchText(oldVdom: VNode, newVdom: VNode) {
  const el = oldVdom.el;
  const {
    children: [oldText],
  } = oldVdom;
  const {
    children: [newText],
  } = newVdom;
  if (typeof oldText !== 'string' || typeof newText !== 'string') {
    throw new Error('Text node children should be strings');
  }
  if (oldText !== newText) {
    el.nodeValue = newText;
  }
}

function patchElement(oldVdom: VNode, newVdom: VNode, hostComponent?: Component<unknown, unknown>) {
  const el = oldVdom.el as Element;
  const { class: oldClass, style: oldStyle, on: oldEvents, ...oldAttrs } = oldVdom.props;
  const { class: newClass, style: newStyle, on: newEvents, ...newAttrs } = newVdom.props;
  const { listeners: oldListeners } = oldVdom;

  patchAttrs(el, oldAttrs, newAttrs);
  patchClasses(el, oldClass, newClass);
  patchStyles(el, oldStyle, newStyle);
  newVdom.listeners = patchEvents(el, oldListeners, oldEvents, newEvents, hostComponent);
}

function patchAttrs(el: Element, oldAttrs: Record<string, any>, newAttrs: Record<string, any>) {
  const { added, removed, updated } = objectsDiff(oldAttrs, newAttrs);
  for (const attr of removed) {
    removeAttribute(el, attr);
  }

  for (const attr of added.concat(updated)) {
    setAttribute(el, attr, newAttrs[attr]);
  }
}

function patchClasses(el: Element, oldClass: string | string[], newClass: string | string[]) {
  const oldClasses = toClassList(oldClass);
  const newClasses = toClassList(newClass);

  const { added, removed } = arraysDiff(oldClasses, newClasses);
  if (removed.length > 0) {
    el.classList.remove(...removed);
  }
  if (added.length > 0) {
    el.classList.add(...removed);
  }
}

function patchStyles(
  el: Element,
  oldStyle: Record<string, string>,
  newStyle: Record<string, string>
) {
  const { added, removed, updated } = objectsDiff(oldStyle, newStyle);
  for (const style of removed) {
    removeStyle(el, style);
  }
  for (const style of added.concat(updated)) {
    setStyle(el, style, newStyle[style]);
  }
}

function patchEvents(
  el: Element,
  oldListeners: Record<string, any> = {},
  oldEvents: Record<string, any> = {},
  newEvents: Record<string, any> = {},
  hostComponent?: Component<unknown, unknown>
) {
  const { added, removed, updated } = objectsDiff(oldEvents, newEvents);
  for (const eventName of removed.concat(updated)) {
    el.removeEventListener(eventName, oldListeners[eventName]);
  }
  const addedListeners: Record<string, any> = {};
  for (const eventName of added.concat(updated)) {
    const listener = addEventListener(eventName, newEvents[eventName], el, hostComponent);
    addedListeners[eventName] = listener;
  }
  return addedListeners;
}

function toClassList(classes: string | string[] = '') {
  return Array.isArray(classes)
    ? classes.filter(isNotBlankOrEmptyString)
    : classes.split(/(\s+)/).filter(isNotBlankOrEmptyString);
}

function patchChildren(
  oldVdom: VNode,
  newVdom: VNode,
  hostComponent?: Component<unknown, unknown>
) {
  const oldChildren = extractChildren(oldVdom);
  const newChildren = extractChildren(newVdom);
  const parentEl = oldVdom.el as Element;

  const diffSeq = arraysDiffSequence(oldChildren, newChildren, areNodesEqual);

  for (const operation of diffSeq) {
    const { index, item } = operation;
    const offset = hostComponent.offset ?? 0;

    switch (operation.op) {
      case ARRAY_DIFF_OP.ADD: {
        mountDOM(item, parentEl, index + offset, hostComponent);
        break;
      }

      case ARRAY_DIFF_OP.REMOVE: {
        destroyDOM(item);
        break;
      }

      case ARRAY_DIFF_OP.MOVE: {
        const oldChild = oldChildren[operation.originalIndex];
        const newChild = newChildren[index];
        const el = oldChild.el;
        const elAtTargetIndex = parentEl.childNodes[index + offset];

        parentEl.insertBefore(el, elAtTargetIndex);
        patchDOM(oldChild, newChild, parentEl, hostComponent);

        break;
      }

      case ARRAY_DIFF_OP.NOOP: {
        patchDOM(oldChildren[operation.originalIndex], newChildren[index], parentEl, hostComponent);
        break;
      }
    }
  }
}

function patchComponent(oldVdom: VNode, newVdom: VNode) {
  const { component } = oldVdom;
  const { props } = newVdom;

  const { key, ...componentProps } = props;
  component.updateProps(componentProps);

  newVdom.component = component;
  newVdom.el = component.firstElement;
}
