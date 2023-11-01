import { Entries } from './types';

type Attributes = {
  class: string | string[];
  style: Record<string, string>;
} & HtmlAttribute;

export type GenericElement = Element & Record<string, any>;

export type HtmlAttribute<T extends GenericElement = GenericElement> = T;

export function setAttributes(el: GenericElement, attrs: Attributes) {
  const { class: className, style, ...otherAttrs } = attrs;

  if (className) {
    setClass(el, className);
  }
  if (style) {
    Object.entries(style).forEach(([prop, value]) => {
      setStyle(el, prop, value);
    });
  }
  for (const [name, value] of Object.entries(otherAttrs) as Entries<HtmlAttribute>) {
    setAttribute(el, name, value);
  }
}

export function setClass(el: GenericElement, className: string | string[]) {
  el.className = '';
  if (typeof className === 'string') {
    el.className = className;
  }
  if (Array.isArray(className)) {
    el.classList.add(...className);
  }
}
export function setStyle(el: GenericElement, name: string, value: string) {
  el.style[name as any] = value;
}
export function removeStyle(el: GenericElement, name: string) {
  el.style[name as any] = null;
}
export function setAttribute<TAttr extends keyof HtmlAttribute>(
  el: GenericElement,
  name: TAttr,
  value: HtmlAttribute[TAttr] | null
) {
  if (value == null) {
    removeAttribute(el, name);
  } else if (name.startsWith('data-')) {
    el.setAttribute(name, value as string);
  } else {
    el[name] = value;
  }
}

export function removeAttribute<TAttr extends keyof HtmlAttribute>(el: GenericElement, name: TAttr) {
  el[name] = null;
  el.removeAttribute(name);
}
