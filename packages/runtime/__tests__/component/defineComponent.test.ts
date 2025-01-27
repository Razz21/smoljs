import { defineComponent } from '@/component/defineComponent';
import { createVNode } from '@/vdom';
import { describe, expect, it, vi } from 'vitest';

describe('component/defineComponent', () => {
  it('should define a component with render function', () => {
    const render = vi.fn().mockReturnValue(createVNode('div'));
    const Component = defineComponent({ render });
    const instance = new Component();
    expect(instance.render()).toEqual(createVNode('div'));
    expect(render).toHaveBeenCalled();
  });

  it('should define a component with state', () => {
    const render = vi.fn().mockReturnValue(createVNode('div'));
    const state = () => ({ count: 0 });
    const Component = defineComponent({ render, state });
    const instance = new Component();
    expect(instance.state).toEqual({ count: 0 });
  });

  it('should define a component with methods', () => {
    const render = vi.fn().mockReturnValue(createVNode('div'));

    const state = () => ({ count: 0 });
    const Component = defineComponent({
      render,
      state,
      methods: {
        increment() {
          this.updateState((prev) => ({ count: prev.count + 1 }));
        },
      },
    });
    const instance = new Component();
    const hostEl = document.createElement('div');
    instance.mount(hostEl);
    instance.increment();
    expect(instance.state.count).toBe(1);
  });

  it('should call lifecycle hooks', async () => {
    const render = vi.fn().mockReturnValue(createVNode('div'));
    const onMounted = vi.fn();
    const onUnmounted = vi.fn();
    const onUpdated = vi.fn();
    const Component = defineComponent({ render, onMounted, onUnmounted, onUpdated });
    const instance = new Component();
    await instance.onMounted();
    expect(onMounted).toHaveBeenCalled();
    await instance.onUnmounted();
    expect(onUnmounted).toHaveBeenCalled();
    await instance.onUpdated();
    expect(onUpdated).toHaveBeenCalled();
  });

  it('should throw an error when trying to override an existing property', () => {
    const render = vi.fn().mockReturnValue(createVNode('div'));

    expect(() => defineComponent({ render, methods: { render: () => {} } })).toThrowError(
      'Method "render()" already exists in the component. Can\'t override'
    );
  });
});
