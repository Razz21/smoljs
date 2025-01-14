import type { Entries } from '@/types';

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
  el.style.setProperty(name, value);
}
export function removeStyle(el: GenericElement, name: string) {
  el.style.removeProperty(name);
}
export function setAttribute<TAttr extends keyof HtmlAttribute>(
  el: GenericElement,
  name: TAttr,
  value: HtmlAttribute[TAttr] | null
) {
  if (value == null) {
    el.removeAttribute(name);
  } else {
    el.setAttribute(name, value as string);
  }
}

export function removeAttribute<TAttr extends keyof HtmlAttribute>(
  el: GenericElement,
  name: TAttr
) {
  el[name] = null;
  el.removeAttribute(name);
}
