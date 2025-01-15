import type { ComponentContext } from '@/component';
import type { VNode } from '@/vdom';

export type Key = any;
export type Attributes = {
  key?: Key;
};

export type FunctionComponent<P = {}> = (props: Attributes & P, context: ComponentContext) => VNode;
