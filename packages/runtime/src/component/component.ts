import { destroyVNode } from '@/destroy-dom';
import { mountVNode } from '@/mount-dom';
import { patchDOM } from '@/patch-dom';
import { extractChildNodes } from '@/utils';
import { type VNode, isClassComponentVNode, isElementVNode, isFragmentVNode } from '@/vdom';
import equals from 'fast-deep-equal';

export abstract class Component<TProps, TState> {
  #isMounted = false;
  #vdom: VNode = null;
  #hostEl: Element = null;

  state: Readonly<TState>;
  props: Readonly<TProps>;
  children: VNode[];

  #refs: Record<string, Element> = {};

  constructor(props?: TProps, children?: VNode[]) {
    this.props = props ?? ({} as TProps);
    this.children = children ?? [];
  }

  get $refs() {
    return this.#refs;
  }

  get elements(): Element[] {
    if (!this.#vdom) return [];
    return isFragmentVNode(this.#vdom)
      ? this.#extractFragmentElements()
      : [this.#vdom.el as Element];
  }

  get firstElement(): Element | null {
    return this.elements[0] ?? null;
  }

  get offset(): number {
    return isFragmentVNode(this.#vdom)
      ? Array.from(this.#hostEl.childNodes).indexOf(this.firstElement)
      : 0;
  }

  abstract render(): VNode;
  abstract onMounted(): void;
  abstract onUnmounted(): void;
  abstract onUpdated(): void;

  updateProps(props: Partial<TProps>) {
    const newProps = { ...this.props, ...props };
    if (equals(this.props, newProps)) return;
    this.props = newProps;
    this.#patch();
  }

  updateState(state: Partial<TState> | ((prevState: TState) => TState)) {
    const newState = typeof state === 'function' ? state(this.state) : { ...this.state, ...state };
    if (equals(this.state, newState)) return; // Skip if state hasn't changed
    this.state = newState;
    this.#patch();
  }

  mount(hostEl: Element, index: number = null) {
    if (this.#isMounted) {
      throw new Error('Component is already mounted');
    }
    this.#vdom = this.render();
    mountVNode(this.#vdom, hostEl, index, this);

    this.#setRefs();
    this.#hostEl = hostEl;
    this.#isMounted = true;
    this.onMounted();
  }

  unmount() {
    if (!this.#isMounted) {
      throw new Error('Component is not mounted');
    }
    this.#refs = {};
    destroyVNode(this.#vdom);
    this.#vdom = null;
    this.#hostEl = null;
    this.#isMounted = false;
    this.onUnmounted();
  }

  forceUpdate() {
    this.#patch();
  }

  #patch() {
    if (!this.#isMounted) {
      throw new Error('Component is not mounted');
    }
    const vdom = this.render();
    this.#vdom = patchDOM(this.#vdom, vdom, this.#hostEl, this);
    this.onUpdated();
  }

  #setRefs() {
    this.#setRefForVNode(this.#vdom);
    this.children.forEach((child) => {
      if (child.ref) {
        this.#setRefForVNode(child);
      }
    });
  }

  #setRefForVNode(vnode: VNode) {
    if (isElementVNode(vnode) && vnode.ref) {
      this.#setRef(vnode.ref, vnode.el as Element);
    }
  }

  #setRef(ref: string, el: Element) {
    if (this.#refs[ref]) {
      console.warn(`Ref "${ref}" already exists`);
      return;
    }
    this.#refs[ref] = el;
  }

  #extractFragmentElements(): Element[] {
    return extractChildNodes(this.#vdom).flatMap((child) =>
      isClassComponentVNode(child) ? child.component.elements : child.el
    );
  }
}
