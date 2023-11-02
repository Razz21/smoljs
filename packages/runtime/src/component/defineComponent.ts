import { hasOwnProperty } from '@/utils/objects';
import { ComponentInstance, DefineComponentArgs } from './types';
import { Component } from './component';
import { noOp } from '@/dispatcher';

export function defineComponent<TProps, TState, TMethods>({
  render,
  state,
  methods,
  ...lifecycleMethods
}: DefineComponentArgs<TProps, TState, TMethods> & ThisType<Component<TProps, TState> & TMethods>): ComponentInstance<
  TProps,
  TState,
  TMethods
> {
  class BaseComponent extends Component<TProps, TState> {
    constructor(props?: TProps) {
      super(props);
      this.state = state ? state(props) : ({} as TState);
    }

    render() {
      return render.call(this, this.props);
    }
  }
  for (const methodName in lifecycleMethods) {
    if (hasOwnProperty(BaseComponent, methodName)) {
      throw new Error(`Method "${methodName}()" already exists in the component. Can't override`);
    }
    BaseComponent.prototype[methodName] = lifecycleMethods[methodName] ?? noOp;
  }

  for (const methodName in methods) {
    if (hasOwnProperty(BaseComponent, methodName)) {
      throw new Error(`Method "${methodName}()" already exists in the component. Can't override`);
    }
    (BaseComponent.prototype as any)[methodName] = methods[methodName];
  }

  return BaseComponent as any;
}
