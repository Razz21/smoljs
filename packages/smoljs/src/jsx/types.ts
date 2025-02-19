import type { Attributes, VNode, VNodeChildren } from '@smoljs/runtime';

type MapOnEvents<T> = {
  [K in keyof T as K extends `on${infer Event}` ? `on${Capitalize<Event>}` : K]: T[K];
};

type HTMLAttributes<T extends keyof HTMLElementTagNameMap> = Partial<
  MapOnEvents<Omit<HTMLElementTagNameMap[T], 'children' | 'style'>>
> & {
  style?: Partial<CSSStyleDeclaration> & { [key: string]: any };
  [key: string]: any;
};

export type IntrinsicElementAttributes = {
  [K in keyof HTMLElementTagNameMap]: HTMLAttributes<K>;
};

declare module '@smoljs/runtime' {
  function Fragment(_props: Attributes & { children?: JSX.Element | JSX.Element[] }): VNode;
}

declare global {
  export namespace JSX {
    type Element = VNode | VNodeChildren | HTMLElement;
    type ElementType =
      | keyof IntrinsicElements
      | ((props: any) => Element)
      | (new (
          props: any
        ) => ElementClass);
    interface IntrinsicAttributes extends Attributes {}
    interface IntrinsicElements extends IntrinsicElementAttributes {
      [elemName: string]: any;
    }
    interface ElementClass {
      render: any;
    }
    interface ElementAttributesProperty {
      props: {};
    }
    interface ElementChildrenAttribute {
      children: {};
    }
  }
}
export {};
