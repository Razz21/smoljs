import { VNode } from '@/h';

export type ComponentParams<TProps, TState, TMethods> = {
  render: (props: TProps) => VNode;
  state?: (props: TProps) => TState;
  methods?: TMethods;
};

export type ComponentInstance<TProps, TState, TMethods> = {
  state: TState;
  props: TProps;

  mount(hostEl: Element, index?: number): void;
  unmount(): void;
  render(props: TProps): VNode;
  updateState(state: Partial<TState>): void;

  get offset(): number;
  get firstElement(): Element | Text;
  get elements(): (Element | Text)[];
} & TMethods;

export type Component<TProps = unknown, TState = unknown, TMethods = unknown> = ComponentInstance<
  TProps,
  TState,
  TMethods
>;
