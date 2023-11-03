import { destroyDOM } from './destroy-dom';
import { mountDOM } from './mount-dom';
import { VNode, h } from './h';
import { ComponentInstance } from './component';

export function createApp<TProps>(RootComponent: ComponentInstance<TProps>, props: TProps = null) {
  let parentEl: Element = null;
  let isMounted: boolean = false;
  let vdom: VNode = null;

  function reset() {
    parentEl = null;
    isMounted = false;
    vdom = null;
  }

  return {
    mount(_parentEl: Element | null) {
      if (!_parentEl) {
        console.warn('createApp.mount(): Element does not exists.');
        return;
      }
      if (isMounted) {
        throw new Error('The application is already mounted');
      }

      parentEl = _parentEl;
      vdom = h(RootComponent, props);
      mountDOM(vdom, parentEl);

      isMounted = true;
    },

    unmount() {
      if (!isMounted) {
        throw new Error('The application is not mounted');
      }
      destroyDOM(vdom);
      reset();
    },
  };
}
