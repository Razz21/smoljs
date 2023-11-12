import { DOM_TYPES, type VNode } from '@/vdom';
import { destroyDOM } from '@/destroy-dom';
import { mountDOM } from '@/mount-dom';
import { patchDOM } from '@/patch-dom';
import { extractChildren } from '@/utils';

export interface ComponentLifecycleMethods {
  onMounted?: () => void;
  onUnmounted?: () => void;
  onUpdated?: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface Component<TProps, TState> extends ComponentLifecycleMethods {}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export abstract class Component<TProps, TState> {
  #isMounted = false;
  #vdom: VNode = null;
  #hostEl: Element = null;

  state: Readonly<TState>;
  props: Readonly<TProps>;
  children: VNode[];

  constructor(props?: TProps, children?: VNode[]) {
    this.props = props ?? ({} as TProps);
    this.children = children ?? [];
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
    this.onUpdated?.();
  }
  updateState(state: Partial<TState> | ((prevState: TState) => TState)) {
    const currentState = this.state;
    let newState: TState;
    if (typeof state === 'function') {
      newState = state(currentState);
    } else {
      newState = { ...this.state, ...state };
    }
    this.state = newState;
    this.#patch();
    this.onUpdated?.();
  }
  abstract render(): VNode;

  mount(hostEl: Element, index: number = null) {
    if (this.#isMounted) {
      throw new Error('Component is mounted');
    }
    this.#vdom = this.render();
    mountDOM(this.#vdom, hostEl, index, this);
    this.#hostEl = hostEl;
    this.#isMounted = true;
    this.onMounted?.();
  }
  unmount() {
    if (!this.#isMounted) {
      throw new Error('Component is not mounted');
    }
    destroyDOM(this.#vdom);
    this.#vdom = null;
    this.#hostEl = null;
    this.#isMounted = false;
    this.onUnmounted?.();
  }
  #patch() {
    if (!this.#isMounted) {
      throw new Error('Component is not mounted');
    }
    const vdom = this.render();
    this.#vdom = patchDOM(this.#vdom, vdom, this.#hostEl, this);
  }
}
