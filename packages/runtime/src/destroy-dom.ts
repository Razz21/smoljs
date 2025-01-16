import { removeEventListeners } from '@/events';
import { type VNode, isClassComponent } from '@/vdom';

export function destroyDOM(vdom: VNode) {
  const { type } = vdom;

  if (isClassComponent(type)) {
    vdom.component.unmount();
    return;
  }
  return removeElement(vdom);
}

function removeElement(vdom: VNode) {
  const { el, children, listeners } = vdom;
  el?.remove();
  children.forEach(destroyDOM);
  if (listeners) {
    removeEventListeners(listeners, el);
    // FIXME: delete operator has performance negative effects for the V8 hidden classes pattern
    // https://v8.dev/docs/hidden-classes
    delete vdom.listeners;
  }
}
