import { destroyDOM } from '@/destroy-dom';
import { DOM_TYPES, extractChildren, VNode } from '@/h';
import { mountDOM } from '@/mount-dom';
import { patchDOM } from '@/patch-dom';
import { hasOwnProperty } from '@/utils/objects';
import { Component, ComponentClassInstance, ComponentParams } from './types';

export function defineComponent<TProps, TState, TMethods>({
  render,
  state,
  methods,
}: ComponentParams<TProps, TState, TMethods> & ThisType<ComponentClassInstance<TProps, TState, TMethods>>): Component<
  TProps,
  TState,
  TMethods
> {
  class BaseComponent implements ComponentClassInstance<TProps, TState> {
    #isMounted = false;
    #vdom: VNode = null;
    #hostEl: Element = null;

    state: TState;
    props: TProps;

    constructor(props?: TProps) {
      this.state = state ? state(props) : ({} as TState);
      this.props = props ?? ({} as TProps);
    }

    get elements() {
      if (this.#vdom == null) {
        return [];
      }
      if (this.#vdom.type === DOM_TYPES.FRAGMENT) {
        // return extractChildren(this.#vdom).map((child) => child.el);
        return extractChildren(this.#vdom).flatMap((child) => {
          if (child.type === DOM_TYPES.COMPONENT) {
            return child.component.elements;
          }
          return child.el;
        });
      }
      return [this.#vdom.el];
    }
    get firstElement() {
      return this.elements[0];
    }
    get offset() {
      if (this.#vdom.type === DOM_TYPES.FRAGMENT) {
        return Array.from(this.#hostEl.childNodes).indexOf(this.firstElement);
      }
      return 0;
    }

    updateProps(props: Partial<TProps>) {
      // TODO test for equality
      this.props = { ...this.props, ...props };
      this.#patch();
    }
    updateState(state: Partial<TState>) {
      this.state = { ...this.state, ...state };
      this.#patch();
    }
    render(): VNode {
      return render.call(this, this.props);
    }
    mount(hostEl: Element, index: number = null) {
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
    if (hasOwnProperty(BaseComponent, methodName)) {
      throw new Error(`Method "${methodName}()" already exists in the component. Can't override`);
    }
    (BaseComponent.prototype as any)[methodName] = methods[methodName];
  }

  return BaseComponent as new (...args: any[]) => BaseComponent & TMethods;
}
