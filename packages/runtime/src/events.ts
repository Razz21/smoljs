import { Component } from './component';
import { ElementVNodeListeners } from './h';
import { AnyFunction } from './types';

export function addEventListener(
  eventName: string,
  handler: AnyFunction,
  el: Element,
  hostComponent: Component = null
) {
  function boundHandler(...args: Parameters<AnyFunction>) {
    hostComponent ? handler.apply(hostComponent, args) : handler(...args);
  }
  el.addEventListener(eventName, boundHandler);
  return boundHandler;
}

export function addEventListeners(listeners: ElementVNodeListeners = {}, el: Element, hostComponent: Component = null) {
  const addedListeners: ElementVNodeListeners = {};
  Object.entries(listeners).forEach(([eventName, handler]) => {
    const listener = addEventListener(eventName, handler, el, hostComponent);
    addedListeners[eventName] = listener;
  });
  return addedListeners;
}

export function removeEventListeners(listeners: ElementVNodeListeners, el: Element) {
  Object.entries(listeners).forEach(([eventName, handler]) => {
    el.removeEventListener(eventName, handler);
  });
}
