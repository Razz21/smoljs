import { Entries } from './types';

type Attributes = {
  class: string | string[];
  style: Record<string, string>;
} & HtmlAttribute;

export type GenericHTMLElement = HTMLElement & Record<string, any>;

export type HtmlAttribute<T extends GenericHTMLElement = GenericHTMLElement> = T;

export function setAttributes(el: GenericHTMLElement, attrs: Attributes) {
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

export function setClass(el: GenericHTMLElement, className: string | string[]) {
  el.className = '';
  if (typeof className === 'string') {
    el.className = className;
  }
  if (Array.isArray(className)) {
    el.classList.add(...className);
  }
}
export function setStyle(el: GenericHTMLElement, name: string, value: string) {
  el.style[name as any] = value;
}
export function removeStyle(el: GenericHTMLElement, name: string) {
  el.style[name as any] = null;
}
export function setAttribute<TAttr extends keyof HtmlAttribute>(
  el: GenericHTMLElement,
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

export function removeAttribute<TAttr extends keyof HtmlAttribute>(el: GenericHTMLElement, name: TAttr) {
  el[name] = null;
  el.removeAttribute(name);
}
