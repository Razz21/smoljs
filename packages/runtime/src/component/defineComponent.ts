import { hasOwnProperty, noOp } from '@/utils';
import type { VNode } from '@/vdom';
import { Component } from './component';
import type { ComponentInstance, DefineComponentArgs } from './types';

export function defineComponent<TProps, TState, TMethods>({
  render,
  state,
  methods,
  onMounted = noOp,
  onUnmounted = noOp,
  onUpdated = noOp,
}: DefineComponentArgs<TProps, TState, TMethods> &
  ThisType<Component<TProps, TState> & TMethods>): ComponentInstance<TProps, TState, TMethods> {
  class BaseComponent extends Component<TProps, TState> {
    constructor(props?: TProps, children?: VNode[]) {
      super(props, children);
      this.state = state ? state(props) : ({} as TState);
    }

    render(): any {
      return render.call(this, this.props, { children: this.children });
    }

    onMounted() {
      return Promise.resolve(onMounted.call(this));
    }
    onUnmounted() {
      return Promise.resolve(onUnmounted.call(this));
    }
    onUpdated() {
      return Promise.resolve(onUpdated.call(this));
    }
  }

  for (const methodName in methods) {
    if (hasOwnProperty(BaseComponent, methodName)) {
      throw new Error(`Method "${methodName}()" already exists in the component. Can't override`);
    }
    (BaseComponent.prototype as any)[methodName] = methods[methodName];
  }

  return BaseComponent as any;
}
