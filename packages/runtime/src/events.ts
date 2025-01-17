import type { Component } from '@/component';
import type { AnyFunction } from '@/types';
import type { ElementVNodeListeners } from '@/vdom';

export function addEventListener(
  eventName: string,
  handler: AnyFunction,
  element: Element,
  hostComponent: Component<unknown, unknown> = null
) {
  const wrappedHandler: EventListener = (...args) => {
    hostComponent ? handler.apply(hostComponent, args) : handler(...args);
  };
  element.addEventListener(eventName, wrappedHandler);
  return wrappedHandler;
}

export function addEventListeners(
  eventListeners: ElementVNodeListeners = {},
  element: Element,
  hostComponent: Component<unknown, unknown> = null
) {
  const activeListeners: ElementVNodeListeners = {};

  Object.entries(eventListeners).forEach(([eventName, handler]) => {
    const listener = addEventListener(eventName, handler, element, hostComponent);
    activeListeners[eventName] = listener;
  });

  return activeListeners;
}

export function removeEventListeners(eventListeners: ElementVNodeListeners, element: Element) {
  Object.entries(eventListeners).forEach(([eventName, handler]) => {
    element.removeEventListener(eventName, handler);
  });
}
