import { VNode } from '@/h';

export type ComponentParams<TProps, TState, TMethods> = {
  render: (props: TProps) => VNode;
  state?: (props: TProps) => TState;
  methods?: TMethods;
};

export interface ComponentInstance<TProps, TState> {
  state: TState;
  props: TProps;

  mount(hostEl: Element, index?: number): void;
  unmount(): void;
  render(): VNode;
  updateState(state: Partial<TState>): void;
  updateProps(state: Partial<TProps>): void;

  get offset(): number;
  get firstElement(): Element | Text;
  get elements(): (Element | Text)[];
}

export type ComponentClassInstance<TProps = unknown, TState = unknown, TMethods = unknown> = ComponentInstance<
  TProps,
  TState
> &
  TMethods;

export type Component<TProps, TState, TMethods> = new (props?: TProps) => ComponentClassInstance<
  TProps,
  TState,
  TMethods
>;
