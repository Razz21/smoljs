import { addEventListener, addEventListeners, removeEventListeners } from '@/events';
import { describe, expect, it, vi } from 'vitest';

describe('addEventListener', () => {
  it('should add an event listener to an element', () => {
    const element = document.createElement('div');
    const handler = vi.fn();
    const wrappedHandler = addEventListener('click', handler, element);

    element.dispatchEvent(new Event('click'));
    expect(handler).toHaveBeenCalled();
    expect(wrappedHandler).toBeInstanceOf(Function);
  });
});

describe('addEventListeners', () => {
  it('should add multiple event listeners to an element', () => {
    const element = document.createElement('div');
    const handlers = { click: vi.fn(), mouseover: vi.fn() };
    const activeListeners = addEventListeners(handlers, element);

    element.dispatchEvent(new Event('click'));
    element.dispatchEvent(new Event('mouseover'));
    expect(handlers.click).toHaveBeenCalled();
    expect(handlers.mouseover).toHaveBeenCalled();
    expect(activeListeners.click).toBeInstanceOf(Function);
    expect(activeListeners.mouseover).toBeInstanceOf(Function);
  });
});

describe('removeEventListeners', () => {
  it('should remove event listeners from an element', () => {
    const element = document.createElement('div');
    const handlers = { click: vi.fn(), mouseover: vi.fn() };
    const activeListeners = addEventListeners(handlers, element);

    removeEventListeners(activeListeners, element);
    element.dispatchEvent(new Event('click'));
    element.dispatchEvent(new Event('mouseover'));
    expect(handlers.click).not.toHaveBeenCalled();
    expect(handlers.mouseover).not.toHaveBeenCalled();
  });
});
