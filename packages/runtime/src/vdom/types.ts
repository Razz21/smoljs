import type { AnyFunction } from '@/types';

export type ElementTag = keyof HTMLElementTagNameMap;

export type Events = {
  [K in keyof HTMLElementEventMap]?: (event?: HTMLElementEventMap[K]) => any;
};

export type ElementVNodeListeners = Record<string, AnyFunction>;

export type SelectHTMLAttributes<Tag extends ElementTag> = HTMLElementTagNameMap[Tag];

export type Key = any;
export type Attributes = {
  key?: Key;
};
