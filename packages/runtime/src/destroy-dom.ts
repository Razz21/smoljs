import { removeEventListeners } from '@/events';
import { type VNode, isClassComponent } from '@/vdom';

/**
 * Recursively destroys a VNode and its children, unmounting components and cleaning up DOM elements.
 */
export function destroyVNode(vnode: VNode): void {
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

  // Remove event listeners if they exist.
  if (listeners) {
    if (el instanceof Element) {
      removeEventListeners(listeners, el);
    }
    // TODO: delete operator may have performance negative effects for the V8 hidden classes pattern
    // https://v8.dev/docs/hidden-classes
    // delete vnode.listeners
    vnode.listeners = null;
  }

  // Recursively destroy child VNodes.
  children.forEach(destroyVNode);

  // Remove the DOM element.
  el?.remove();
}
