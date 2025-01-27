import { createApp } from '@/app';
import { defineComponent } from '@/component';
import { createVNode } from '@/vdom';
import { describe, expect, it, vi } from 'vitest';

describe('createApp', () => {
  const render = () => createVNode('span');
  const RootComponent = defineComponent({ render });

  describe('mount', () => {
    it('should mount the app with a valid element', () => {
      const app = createApp(RootComponent);
      const root = document.createElement('div');
      app.mount(root);

      expect(root.children).toHaveLength(1);
      expect(root.children[0].tagName).toBe('SPAN');
    });

    it('should warn if the element is null', () => {
      const app = createApp(RootComponent);
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      app.mount(null);

      expect(consoleWarnSpy).toHaveBeenCalledWith('createApp.mount(): Element does not exists.');
      consoleWarnSpy.mockRestore();
    });

    it('should throw an error if already mounted', () => {
      const app = createApp(RootComponent);
      const root = document.createElement('div');

      app.mount(root);

      expect(() => app.mount(root)).toThrow('The application is already mounted');
    });
  });

  describe('unmount', () => {
    it('should unmount the app when mounted', () => {
      const app = createApp(RootComponent);
      const root = document.createElement('div');

      app.mount(root);
      app.unmount();

      expect(root.children).toHaveLength(0);
    });

    it('should throw an error if not mounted', () => {
      const app = createApp(RootComponent);

      expect(() => app.unmount()).toThrow('The application is not mounted');
    });
  });
});
