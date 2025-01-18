import { removeEventListeners } from '@/events';
import { type VNode, isClassComponent, isVNode } from '@/vdom';

/**
 * Recursively destroys a VNode and its children, unmounting components and cleaning up DOM elements.
 */
export function destroyVNode(vnode: VNode): void {
  if (!isVNode(vnode)) return;
  const { type } = vnode;

  if (isClassComponent(type)) {
    destroyComponentVNode(vnode);
  } else {
    destroyElementVNode(vnode);
  }
}

/**
 * Destroys a class component VNode by unmounting its component.
 */
function destroyComponentVNode(vnode: VNode): void {
  vnode.component?.unmount();
}

/**
 * Destroys a non-component VNode by removing its DOM element, event listeners, and recursively cleaning children.
 */
function destroyElementVNode(vnode: VNode): void {
  const { el, children, listeners } = vnode;

  if (listeners) {
    if (el instanceof Element) {
      removeEventListeners(listeners, el);
    }
    vnode.listeners = null;
  }

  children.forEach(destroyVNode);
  el?.remove();
}
