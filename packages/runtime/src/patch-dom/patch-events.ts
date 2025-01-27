import type { Component } from '@/component';
import { addEventListener } from '@/events';
import { objectsDiff } from '@/utils';

export function patchEvents(
  el: Element,
  oldListeners: Record<string, any> = {},
  oldEvents: Record<string, any> = {},
  newEvents: Record<string, any> = {},
  hostComponent?: Component<unknown, unknown>
) {
  const { added, removed, updated } = objectsDiff(oldEvents, newEvents);

  [...removed, ...updated].forEach((eventName) =>
    el.removeEventListener(eventName, oldListeners[eventName])
  );

  const newListeners: Record<string, any> = {};
  [...added, ...updated].forEach((eventName) => {
    newListeners[eventName] = addEventListener(eventName, newEvents[eventName], el, hostComponent);
  });

  return newListeners;
}
