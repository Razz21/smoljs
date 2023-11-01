import { areNodesEqual } from './nodes-equal';
import { destroyDOM } from './destroy-dom';
import { mountDOM } from './mount-dom';
import { ComponentVNode, DOM_TYPES, ElementVNode, FragmentVNode, TextVNode, VNode, extractChildren } from './h';
import { objectsDiff } from './utils/objects';
import { removeAttribute, removeStyle, setAttribute, setStyle } from './attributes';
import { arraysDiff, ARRAY_DIFF_OP, arraysDiffSequence } from './utils/arrays';
import { isNotBlankOrEmptyString } from './utils/strings';
import { addEventListener } from './events';
import { ComponentClassInstance } from './component';

export function patchDOM(oldVdom: VNode, newVdom: VNode, parentEl: Element, hostComponent?: ComponentClassInstance) {
  if (!areNodesEqual(oldVdom, newVdom)) {
    const index = Array.from(parentEl.childNodes).indexOf(oldVdom.el);
    destroyDOM(oldVdom);
    mountDOM(newVdom, parentEl, index, hostComponent);
    return newVdom;
  }
  newVdom.el = oldVdom.el;
  switch (newVdom.type) {
    case DOM_TYPES.TEXT: {
      patchText(oldVdom as typeof newVdom, newVdom);
      return newVdom;
    }
    case DOM_TYPES.ELEMENT: {
      patchElement(oldVdom as typeof newVdom, newVdom, hostComponent);
      break;
    }
    case DOM_TYPES.COMPONENT: {
      patchComponent(oldVdom as typeof newVdom, newVdom);
      // TODO test, if children should be patched
      return newVdom;
    }
  }
  patchChildren(oldVdom as typeof newVdom, newVdom, hostComponent);

  return newVdom;
}

function patchText(oldVdom: TextVNode, newVdom: TextVNode) {
  const el = oldVdom.el;
  const { value: oldText } = oldVdom;
  const { value: newText } = newVdom;
  if (oldText !== newText) {
    el.nodeValue = newText;
  }
}

function patchElement(oldVdom: ElementVNode<any>, newVdom: ElementVNode<any>, hostComponent?: ComponentClassInstance) {
  const el = oldVdom.el;
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

function patchStyles(el: Element, oldStyle: Record<string, string>, newStyle: Record<string, string>) {
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
  hostComponent?: ComponentClassInstance
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
  oldVdom: FragmentVNode | ElementVNode<any>,
  newVdom: FragmentVNode | ElementVNode<any>,
  hostComponent?: ComponentClassInstance
) {
  const oldChildren = extractChildren(oldVdom);
  const newChildren = extractChildren(newVdom);
  const parentEl = oldVdom.el;

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

function patchComponent(oldVdom: ComponentVNode, newVdom: ComponentVNode) {
  const { component } = oldVdom;
  const { props } = newVdom;

  component.updateProps(props);

  newVdom.component = component;
  newVdom.el = component.firstElement;
}
