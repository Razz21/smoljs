import { VNode as VNode_2 } from '../vdom';

declare type AnyFunction = (...args: any) => any;

export declare type Attributes = {
    key?: Key;
};

export declare abstract class Component<TProps, TState> {
    #private;
    state: Readonly<TState>;
    props: Readonly<TProps>;
    children: VNode[];
    constructor(props?: TProps, children?: VNode[]);
    get $refs(): Record<string, Element>;
    get elements(): Element[];
    get firstElement(): Element | null;
    get offset(): number;
    abstract render(): VNode;
    abstract onMounted(): void;
    abstract onUnmounted(): void;
    abstract onUpdated(): void;
    updateProps(props: Partial<TProps>): void;
    updateState(state: Partial<TState> | ((prevState: TState) => TState)): void;
    mount(hostEl: Element, index?: number): void;
    unmount(): void;
}

export declare type ComponentContext = {
    children: VNodeChildren[];
};

export declare type ComponentInstance<TProps = unknown, TState = unknown, TMethods = unknown> = Constructor<Component<TProps, TState> & TMethods>;

declare type Constructor<T> = new (...args: any) => T;

export declare function createApp<TProps>(RootComponent: ComponentInstance<TProps>, props?: TProps): {
    mount(_parentEl: Element | null): void;
    unmount(): void;
};

export declare function createFragmentVNode(children: VNodeChildren[]): VNode;

export declare function createTextVNode(value: string): VNode;

export declare function createVNode(type: VNodeTypes, props?: VNodeProps<any> | null, children?: VNodeChildren[]): VNode;

export declare function defineComponent<TProps, TState, TMethods>({ render, state, methods, onMounted, onUnmounted, onUpdated, }: DefineComponentArgs<TProps, TState, TMethods> & ThisType<Component<TProps, TState> & TMethods>): ComponentInstance<TProps, TState, TMethods>;

export declare type DefineComponentArgs<TProps, TState, TMethods> = {
    render: (props: TProps, context: ComponentContext) => any;
    state?: (props: TProps) => TState;
    methods?: TMethods;
    onMounted?: () => void;
    onUnmounted?: () => void;
    onUpdated?: () => void;
};

declare type ElementProps<T extends ElementTag> = WritableAttributes<HTMLElementTagNameMap[T]>;

export declare type ElementTag = keyof HTMLElementTagNameMap;

export declare type ElementVNodeListeners = Record<string, AnyFunction>;

export declare type Events = {
    [K in keyof HTMLElementEventMap]?: (event?: HTMLElementEventMap[K]) => any;
};

export declare function Fragment(_props: Attributes, { children }: ComponentContext): VNode_2;

export declare const FragmentVNode: unique symbol;

declare type FunctionAttributes<T> = OmitByValue<T, AnyFunction>;

export declare type FunctionComponent<P> = (props: Attributes & P, context: ComponentContext) => VNode;

export declare function h<T>(type: T, props?: (Attributes & InferComponentProps<T>) | null, children?: VNodeChildren[] | null): VNode;

export declare function h<T extends ElementTag>(type: T, props?: VNodeProps<ElementProps<T>> | null, children?: VNodeChildren[] | null): VNode;

export declare function hFragment(vNodes: VNodeChildren[]): VNode;

declare type IfEquals<X, Y, A = X, B = never> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? A : B;

declare type InferComponentProps<T> = T extends ComponentInstance ? InferProps<T> : T extends FunctionComponent<any> ? Parameters<T>[0] : never;

export declare type InferProps<T> = T extends Component<infer Props, any> ? Props : T extends ComponentInstance<infer Props> ? Props : never;

export declare function isClassComponent(type: unknown): type is ComponentInstance<any, any, any>;

export declare function isClassComponentVNode(value?: unknown): boolean;

export declare function isElementVNode(value?: unknown): boolean;

export declare function isFragmentVNode(value?: unknown): boolean;

export declare function isFunctionComponent(type: unknown): type is FunctionComponent<any>;

export declare function isTextVNode(value?: unknown): boolean;

export declare function isVNode(value?: any): value is VNode;

export declare type Key = any;

declare type OmitByValue<T, U> = {
    [K in keyof T]: T[K] extends U ? never : K;
}[keyof T];

declare type OmitEventHandlers<T> = Exclude<T, `on${string}` | 'on'>;

export declare type SelectHTMLAttributes<Tag extends ElementTag> = HTMLElementTagNameMap[Tag];

export declare const TextVNode: unique symbol;

export declare interface VNode {
    _isVNode: true;
    type: VNodeTypes;
    props: VNodeProps<any>;
    children: VNode[];
    el: Element | Text | null;
    ref: string | null;
    listeners: ElementVNodeListeners | null;
    component: Component<any, any> | null;
}

export declare type VNodeChildren = VNode | string | number | boolean | null | undefined | void;

export declare type VNodeProps<T> = {
    class?: string | string[];
    style?: WritableAttributes<CSSStyleDeclaration>;
    on?: Events;
} & Attributes & T;

export declare type VNodeTypes = string | ComponentInstance | typeof TextVNode | typeof FragmentVNode;

declare type WritableAttributes<T> = Partial<Pick<T, OmitEventHandlers<WritableKeys<T> & FunctionAttributes<T>>>>;

declare type WritableKeys<T> = {
    [P in keyof T]-?: IfEquals<{
        [Q in P]: T[P];
    }, {
        -readonly [Q in P]: T[P];
    }, P>;
}[keyof T];

export { }
