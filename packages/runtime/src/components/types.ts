import { ComponentContext } from '@/component';
import { VNode } from '@/vdom';

export type Key = any;
export type Attributes = {
  key?: Key;
};

export type FunctionComponent<P = {}> = (props?: Attributes & (P | null), context?: ComponentContext) => VNode;
