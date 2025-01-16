import {
  applyAttribute,
  applyStyle,
  removeAttribute,
  removeStyle,
} from '@/attributes';
import type { Component } from '@/component';
import { destroyVNode } from '@/destroy-dom';
import { addEventListener } from '@/events';
import { mountVNode } from '@/mount-dom';
import {
  ArrayDiffOperationType,
  areVNodeNodesEqual,
  calculateArrayDifference,
  extractChildNodes,
  generateArrayTransformationSequence,
  isNonBlankString,
  objectsDiff,
} from '@/utils';
import { type VNode, isClassComponentVNode, isElementVNode, isTextVNode } from '@/vdom';

export function patchDOM(
  oldVdom: VNode,
  newVdom: VNode,
  parentEl: Element,
  hostComponent?: Component<unknown, unknown>
) {
  if (!areVNodeNodesEqual(oldVdom, newVdom)) {
    const index = Array.from(parentEl.childNodes).indexOf(oldVdom.el);
    destroyVNode(oldVdom);
    mountVNode(newVdom, parentEl, index, hostComponent);
    return newVdom;
  }

  newVdom.el = oldVdom.el;

  if (isTextVNode(newVdom)) {
    patchText(oldVdom, newVdom);
    return newVdom;
  }

  if (isElementVNode(newVdom)) {
    patchElement(oldVdom, newVdom, hostComponent);
  } else if (isClassComponentVNode(newVdom)) {
    patchComponent(oldVdom, newVdom);
    return newVdom;
  }

  patchChildren(oldVdom, newVdom, hostComponent);
  return newVdom;
}

function patchText(oldVdom: VNode, newVdom: VNode) {
  const { el } = oldVdom;
  const [oldText] = oldVdom.children;
  const [newText] = newVdom.children;

  if (typeof oldText !== 'string' || typeof newText !== 'string') {
    throw new Error('Text node children must be strings');
  }

  if (oldText !== newText) {
    el.nodeValue = newText;
  }
}

function patchElement(oldVdom: VNode, newVdom: VNode, hostComponent?: Component<unknown, unknown>) {
  const el = oldVdom.el as Element;
  const { class: oldClass, style: oldStyle, on: oldEvents, ...oldAttrs } = oldVdom.props;
  const { class: newClass, style: newStyle, on: newEvents, ...newAttrs } = newVdom.props;

  patchAttrs(el, oldAttrs, newAttrs);
  patchClasses(el, oldClass, newClass);
  patchStyles(el, oldStyle, newStyle);
  newVdom.listeners = patchEvents(el, oldVdom.listeners, oldEvents, newEvents, hostComponent);
}

function patchAttrs(el: Element, oldAttrs: Record<string, any>, newAttrs: Record<string, any>) {
  const { added, removed, updated } = objectsDiff(oldAttrs, newAttrs);

  removed.forEach(attr => removeAttribute(el, attr));
  [...added, ...updated].forEach(attr => applyAttribute(el, attr, newAttrs[attr]));
}

function patchClasses(el: Element, oldClass: string | string[], newClass: string | string[]) {
  const oldClasses = toClassList(oldClass);
  const newClasses = toClassList(newClass);
  const { added, removed } = calculateArrayDifference(oldClasses, newClasses);

  if (removed.length) el.classList.remove(...removed);
  if (added.length) el.classList.add(...added);
}

function patchStyles(
  el: Element,
  oldStyle: Record<string, string>,
  newStyle: Record<string, string>
) {
  const { added, removed, updated } = objectsDiff(oldStyle, newStyle);

  removed.forEach(style => removeStyle(el, style));
  [...added, ...updated].forEach(style => applyStyle(el, style, newStyle[style]));
}

function patchEvents(
  el: Element,
  oldListeners: Record<string, any> = {},
  oldEvents: Record<string, any> = {},
  newEvents: Record<string, any> = {},
  hostComponent?: Component<unknown, unknown>
) {
  const { added, removed, updated } = objectsDiff(oldEvents, newEvents);

  [...removed, ...updated].forEach(eventName =>
    el.removeEventListener(eventName, oldListeners[eventName])
  );

  const newListeners: Record<string, any> = {};
  [...added, ...updated].forEach(eventName => {
    newListeners[eventName] = addEventListener(
      eventName,
      newEvents[eventName],
      el,
      hostComponent
    );
  });

  return newListeners;
}

function toClassList(classes: string | string[] = '') {
  return Array.isArray(classes)
    ? classes.filter(isNonBlankString)
    : classes.split(/\s+/).filter(isNonBlankString);
}

function patchChildren(
  oldVdom: VNode,
  newVdom: VNode,
  hostComponent?: Component<unknown, unknown>
) {
  const oldChildren = extractChildNodes(oldVdom);
  const newChildren = extractChildNodes(newVdom);
  const parentEl = oldVdom.el as Element;
  const diffSeq = generateArrayTransformationSequence(oldChildren, newChildren, areVNodeNodesEqual);

  diffSeq.forEach(({ op, index, originalIndex, item }) => {
    const offset = hostComponent?.offset ?? 0;

    switch (op) {
      case ArrayDiffOperationType.ADD:
        mountVNode(item, parentEl, index + offset, hostComponent);
        break;

      case ArrayDiffOperationType.REMOVE:
        destroyVNode(item);
        break;

      case ArrayDiffOperationType.MOVE: {
        const elAtTargetIndex = parentEl.childNodes[index + offset];
        parentEl.insertBefore(oldChildren[originalIndex].el, elAtTargetIndex);
        patchDOM(oldChildren[originalIndex], newChildren[index], parentEl, hostComponent);
        break;
      }

      case ArrayDiffOperationType.NOOP:
        patchDOM(oldChildren[originalIndex], newChildren[index], parentEl, hostComponent);
        break;
    }
  });
}

function patchComponent(oldVdom: VNode, newVdom: VNode) {
  const { component } = oldVdom;
  const { key, ...props } = newVdom.props;

  component.updateProps(props);
  newVdom.component = component;
  newVdom.el = component.firstElement;
}
