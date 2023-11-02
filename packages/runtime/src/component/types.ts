import { VNode } from '@/h';
import { Component, ComponentLifecycleMethods } from './component';

type Constructor<T> = new (...args: any) => T;

export type DefineComponentArgs<TProps, TState, TMethods> = {
  render: (props: TProps) => VNode;
  state?: (props: TProps) => TState;
  methods?: TMethods;
} & ComponentLifecycleMethods;

export type ComponentInstance<TProps = unknown, TState = unknown, TMethods = unknown> = Constructor<
  Component<TProps, TState> & TMethods
>;

export type InferProps<T> = T extends Component<infer Props, any>
  ? Props
  : T extends ComponentInstance<infer Props>
  ? Props
  : never;
