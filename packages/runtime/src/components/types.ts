import type { ComponentContext } from '@/component';
import type { Attributes, VNode } from '@/vdom';

export type FunctionComponent<P> = (props: Attributes & P, context: ComponentContext) => VNode;
