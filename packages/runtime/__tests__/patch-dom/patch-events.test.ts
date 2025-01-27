import { patchEvents } from '@/patch-dom/patch-events';
import { describe, expect, it, vi } from 'vitest';

describe('patchEvents', () => {
  it('should add new event listeners', () => {
    const el = document.createElement('div');
    const handler = vi.fn();
    const newListeners = patchEvents(el, {}, {}, { click: handler });

    el.dispatchEvent(new Event('click'));
    expect(handler).toHaveBeenCalled();
    expect(typeof newListeners.click).toBe('function');
  });

  it('should remove old event listeners', () => {
    const el = document.createElement('div');
    const oldHandler = vi.fn();
    const oldListeners = { click: vi.fn() };
    
    patchEvents(el, oldListeners, { click: oldHandler }, {});
    
    el.dispatchEvent(new Event('click'));
    expect(oldHandler).not.toHaveBeenCalled();
  });

  it('should update existing event listeners', () => {
    const el = document.createElement('div');
    const oldHandler = vi.fn();
    const newHandler = vi.fn();
    const oldListeners = { click: vi.fn() };

    patchEvents(el, oldListeners, { click: oldHandler }, { click: newHandler });

    el.dispatchEvent(new Event('click'));
    expect(oldHandler).not.toHaveBeenCalled();
    expect(newHandler).toHaveBeenCalled();
  });

  it('should handle multiple events simultaneously', () => {
    const el = document.createElement('div');
    const clickHandler = vi.fn();
    const mouseoverHandler = vi.fn();

    const newListeners = patchEvents(
      el,
      {},
      {},
      { click: clickHandler, mouseover: mouseoverHandler }
    );

    el.dispatchEvent(new Event('click'));
    el.dispatchEvent(new Event('mouseover'));
    
    expect(clickHandler).toHaveBeenCalled();
    expect(mouseoverHandler).toHaveBeenCalled();
    expect(Object.keys(newListeners)).toHaveLength(2);
  });

  it('should handle undefined event handlers', () => {
    const el = document.createElement('div');
    expect(() => patchEvents(el, {}, {}, { click: undefined as any }))
      .not.toThrow();
  });
});
