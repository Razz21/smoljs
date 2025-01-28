import type { Component } from '@/component';
import { destroyVNode } from '@/destroy-dom';
import { mountVNode } from '@/mount-dom';
import {
  ArrayDiffOperationType,
  areVNodeNodesEqual,
  extractChildNodes,
  generateArrayTransformationSequence,
} from '@/utils';
import { type VNode, isClassComponentVNode, isElementVNode, isTextVNode } from '@/vdom';
import { patchAttrs } from './patch-attrs';
import { patchClasses } from './patch-classes';
import { patchEvents } from './patch-events';
import { patchStyles } from './patch-styles';

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
  if (isClassComponentVNode(newVdom)) {
    patchComponent(oldVdom, newVdom);
    // TODO: patchChildren for class components
    return newVdom;
  }

  if (isElementVNode(newVdom)) {
    patchElement(oldVdom, newVdom, hostComponent);
  }

  patchChildren(oldVdom, newVdom, hostComponent);
  return newVdom;
}

function patchText(oldVdom: VNode, newVdom: VNode) {
  const { el } = oldVdom;
  const { nodeValue: oldTNodeValue } = oldVdom.props;
  const { nodeValue: newNodeValue } = newVdom.props;

  if (oldTNodeValue !== newNodeValue) {
    el.nodeValue = newNodeValue;
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

function patchComponent(oldVdom: VNode, newVdom: VNode) {
  const { component } = oldVdom;
  const { key, ...props } = newVdom.props;

  component.updateProps(props);
  newVdom.component = component;
  newVdom.el = component.firstElement;
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
