import type { ComponentInstance } from '@/component';
import { destroyVNode } from '@/destroy-dom';
import { h } from '@/h';
import { mountVNode } from '@/mount-dom';
import type { VNode } from '@/vdom';

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
      mountVNode(vdom, parentEl);

      isMounted = true;
    },

    unmount() {
      if (!isMounted) {
        throw new Error('The application is not mounted');
      }
      destroyVNode(vdom);
      reset();
    },
  };
}
