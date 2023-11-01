import { destroyDOM } from './destroy-dom';
import { VNode, DOM_TYPES, extractChildren } from './h';
import { mountDOM } from './mount-dom';
import { patchDOM } from './patch-dom';
import { AnyFunction } from './types/index';
import { hasOwnProperty } from './utils/objects';

type ComponentParams<TProps, TState, TMethods> = {
  render: (props: TProps) => VNode;
  state?: (props: TProps) => TState;
  methods?: TMethods;
};

export type Component = any;

export function defineComponent<
  TProps extends Readonly<Record<string, any>>,
  TState extends Record<string, any>,
  TMethods extends Record<string, AnyFunction>
>({ render, state, methods }: ComponentParams<TProps, TState, TMethods> & ThisType<TState & TMethods>) {
  class Component {
    #isMounted = false;
    #vdom: VNode = null;
    #hostEl: HTMLElement = null;

    state: TState;

    constructor(public props: TProps = {} as TProps) {
      this.state = state ? state(props) : ({} as TState);
    }
    get elements() {
      if (this.#vdom == null) {
        return [];
      }
      if (this.#vdom.type === DOM_TYPES.FRAGMENT) {
        return extractChildren(this.#vdom).map((child) => child.el);
      }
      return [this.#vdom.el];
    }

    get firstElement() {
      return this.elements[0];
    }

    get offset() {
      if (this.#vdom.type === DOM_TYPES.FRAGMENT) {
        // FIXME types
        return Array.from(this.#hostEl.children).indexOf(this.firstElement as Element);
      }
      return 0;
    }

    updateState(state: Partial<TState>) {
      this.state = { ...this.state, ...state };
      this.#patch();
    }
    render() {
      return render.call(this, this.props);
    }
    mount(hostEl: HTMLElement, index: number = null) {
      if (this.#isMounted) {
        throw new Error('Component is mounted');
      }
      this.#vdom = this.render();
      mountDOM(this.#vdom, hostEl, index, this);
      this.#hostEl = hostEl;
      this.#isMounted = true;
    }
    unmount() {
      if (!this.#isMounted) {
        throw new Error('Component is not mounted');
      }
      destroyDOM(this.#vdom);
      this.#vdom = null;
      this.#hostEl = null;
      this.#isMounted = false;
    }
    #patch() {
      if (!this.#isMounted) {
        throw new Error('Component is not mounted');
      }
      const vdom = this.render();
      this.#vdom = patchDOM(this.#vdom, vdom, this.#hostEl, this);
    }
  }
  for (const methodName in methods) {
    if (hasOwnProperty(Component, methodName)) {
      throw new Error(`Method "${methodName}()" already exists in the component. Can't override`);
    }
    (Component.prototype as any)[methodName] = methods[methodName];
  }
  return Component;
}
