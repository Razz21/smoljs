import { VNode } from '@/vdom';
import { Component } from './component';

type Constructor<T> = new (...args: any) => T;

export type ComponentContext = {
  children: VNode[];
};

export type DefineComponentArgs<TProps, TState, TMethods> = {
  render: (props: TProps, context: ComponentContext) => any;
  state?: (props: TProps) => TState;
  methods?: TMethods;
  onMounted?: () => void;
  onUnmounted?: () => void;
  onUpdated?: () => void;
};

export type ComponentInstance<TProps = unknown, TState = unknown, TMethods = unknown> = Constructor<
  Component<TProps, TState> & TMethods
>;

export type InferProps<T> = T extends Component<infer Props, any>
  ? Props
  : T extends ComponentInstance<infer Props>
  ? Props
  : never;
