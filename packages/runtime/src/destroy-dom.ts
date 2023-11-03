import { removeEventListeners } from './events';
import { DOM_TYPES, ElementVNode, FragmentVNode, TextVNode, VNode } from './h';

export function destroyDOM(vdom: VNode) {
  const { type } = vdom;

  switch (type) {
    case DOM_TYPES.TEXT: {
      removeTextNode(vdom);
      break;
    }
    case DOM_TYPES.ELEMENT: {
      removeElement(vdom);
      break;
    }
    case DOM_TYPES.FRAGMENT: {
      removeFragmentNodes(vdom);
      break;
    }
    case DOM_TYPES.COMPONENT: {
      vdom.component.unmount();
      break;
    }
    default: {
      throw new Error(`Can't destroy DOM of type: ${type}`);
    }
  }
}

function removeTextNode(vdom: TextVNode) {
  const { el } = vdom;
  el.remove();
}

function removeElement(vdom: ElementVNode) {
  const { el, children, listeners } = vdom;
  el.remove();
  children.forEach(destroyDOM);
  if (listeners) {
    removeEventListeners(listeners, el);
    delete vdom.listeners;
  }
}

function removeFragmentNodes(vdom: FragmentVNode) {
  const { children } = vdom;
  children.forEach(destroyDOM);
}
