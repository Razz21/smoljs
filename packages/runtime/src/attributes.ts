import type { Entries } from '@/types';

type HtmlAttributes = {
  class: string | string[];
  style: Record<string, string>;
} & HtmlAttribute;

export type GenericHtmlElement = Element & Record<string, any>;

export type HtmlAttribute<T extends GenericHtmlElement = GenericHtmlElement> = T;

export function applyAttributes(element: GenericHtmlElement, attributes: HtmlAttributes): void {
  const { class: className, style, ...otherAttributes } = attributes;

  if (className) {
    applyClass(element, className);
  }

  if (style) {
    Object.entries(style).forEach(([property, value]) => {
      applyStyle(element, property, value);
    });
  }

  for (const [attributeName, attributeValue] of Object.entries(
    otherAttributes
  ) as Entries<HtmlAttribute>) {
    applyAttribute(element, attributeName, attributeValue);
  }
}

export function applyClass(element: GenericHtmlElement, className: string | string[]): void {
  element.className = '';

  if (typeof className === 'string') {
    element.className = className;
  } else if (Array.isArray(className)) {
    element.classList.add(...className);
  }
}

export function applyStyle(
  element: GenericHtmlElement,
  propertyName: string,
  propertyValue: string
): void {
  element.style.setProperty(propertyName, propertyValue);
}

export function removeStyle(element: GenericHtmlElement, propertyName: string): void {
  element.style.removeProperty(propertyName);
}

export function applyAttribute<TAttr extends keyof HtmlAttribute>(
  element: GenericHtmlElement,
  attributeName: TAttr,
  attributeValue: HtmlAttribute[TAttr] | null
): void {
  if (attributeValue == null) {
    element.removeAttribute(attributeName);
  } else {
    element.setAttribute(attributeName, attributeValue as string);
  }
}

export function removeAttribute<TAttr extends keyof HtmlAttribute>(
  element: GenericHtmlElement,
  attributeName: TAttr
): void {
  element[attributeName] = null;
  element.removeAttribute(attributeName);
}
