import { defineComponent } from '@/component';
import { mountVNode } from '@/mount-dom';
import { patchDOM } from '@/patch-dom';
import { createFragmentVNode, createTextVNode, createVNode } from '@/vdom';
import { describe, expect, it, vi } from 'vitest';

describe('patch-dom', () => {
  describe('node replacement', () => {
    it('should replace nodes of different types', () => {
      const root = document.createElement('div');
      const oldVNode = createVNode('div');
      const newVNode = createVNode('span');

      mountVNode(oldVNode, root);
      patchDOM(oldVNode, newVNode, root);

      expect(root.children[0].tagName).toBe('SPAN');
    });

    it('should replace nodes with different keys', () => {
      const root = document.createElement('div');
      const oldVNode = createVNode('div', { key: '1' });
      const newVNode = createVNode('div', { key: '2' });

      mountVNode(oldVNode, root);
      patchDOM(oldVNode, newVNode, root);

      expect(newVNode.el).not.toBe(oldVNode.el);
    });
  });

  describe('text nodes', () => {
    it('should update text content', () => {
      const root = document.createElement('div');
      const oldVNode = createTextVNode('old text');
      const newVNode = createTextVNode('new text');

      mountVNode(oldVNode, root);
      patchDOM(oldVNode, newVNode, root);

      expect(root.textContent).toBe('new text');
    });

    it('should not update text content if unchanged', () => {
      const root = document.createElement('div');
      const text = 'same text';
      const oldVNode = createTextVNode(text);
      const newVNode = createTextVNode(text);

      mountVNode(oldVNode, root);
      const el = oldVNode.el;
      patchDOM(oldVNode, newVNode, root);

      expect(newVNode.el).toBe(el);
    });
  });

  describe('element nodes', () => {
    it('should update element attributes', () => {
      const root = document.createElement('div');
      const oldVNode = createVNode('div', { class: 'old' });
      const newVNode = createVNode('div', { class: 'new' });

      mountVNode(oldVNode, root);
      patchDOM(oldVNode, newVNode, root);

      expect(root.children[0].className).toBe('new');
    });

    it('should handle event listener updates', () => {
      const root = document.createElement('div');
      const oldHandler = vi.fn();
      const newHandler = vi.fn();
      const oldVNode = createVNode('div', { on: { click: oldHandler } });
      const newVNode = createVNode('div', { on: { click: newHandler } });

      mountVNode(oldVNode, root);
      patchDOM(oldVNode, newVNode, root);

      root.children[0].dispatchEvent(new Event('click'));
      expect(oldHandler).not.toHaveBeenCalled();
      expect(newHandler).toHaveBeenCalled();
    });
  });

  describe('component nodes', () => {
    it('should update component props', () => {
      const Component = defineComponent({
        render() {
          return createVNode('div');
        },
      });

      const root = document.createElement('div');
      const oldVNode = createVNode(Component, { value: 'old' });
      const newVNode = createVNode(Component, { value: 'new' });

      mountVNode(oldVNode, root);
      const instance = oldVNode.component;
      patchDOM(oldVNode, newVNode, root);

      expect(newVNode.component).toBe(instance);
      expect(instance.props.value).toBe('new');
    });
  });

  describe.todo('error handling', () => {
    it.todo('should handle null elements gracefully', () => {
      const root = document.createElement('div');
      const oldVNode = createVNode('div');
      const newVNode = createVNode('div');

      mountVNode(oldVNode, root);
      oldVNode.el = null; // Simulate destroyed element

      expect(() => patchDOM(oldVNode, newVNode, root)).not.toThrow();
    });

    it('should handle detached elements', () => {
      const root = document.createElement('div');
      const oldVNode = createVNode('div');
      const newVNode = createVNode('div');

      mountVNode(oldVNode, root);
      root.innerHTML = ''; // Simulate element detachment

      patchDOM(oldVNode, newVNode, root);
      expect(root.children).toHaveLength(1);
    });
  });

  describe('patchChildren', () => {
    it.each([
      {
        name: 'should handle empty -> non-empty children',
        oldChildren: [],
        newChildren: ['text', createVNode('div')],
        expectedLength: 2,
      },
      {
        name: 'should handle non-empty -> empty children',
        oldChildren: ['text', createVNode('div')],
        newChildren: [],
        expectedLength: 0,
      },
      {
        name: 'should handle null/undefined children',
        oldChildren: [null, undefined, 'text'],
        newChildren: ['new text'],
        expectedLength: 1,
      },
    ])('$name', ({ oldChildren, newChildren, expectedLength }) => {
      const root = document.createElement('div');
      const oldVNode = createVNode('div', null, oldChildren);
      const newVNode = createVNode('div', null, newChildren);

      mountVNode(oldVNode, root);
      patchDOM(oldVNode, newVNode, root);

      expect(root.firstElementChild.childNodes).toHaveLength(expectedLength);
    });
  });

  describe('reordering', () => {
    it('should handle child reordering', () => {
      const root = document.createElement('div');
      const child1 = createVNode('div', { key: '1' });
      const child2 = createVNode('div', { key: '2' });
      const child3 = createVNode('div', { key: '3' });

      const oldVNode = createVNode('div', null, [child1, child2, child3]);
      const newVNode = createVNode('div', null, [child3, child1, child2]);

      mountVNode(oldVNode, root);
      const originalElements = Array.from(root.firstElementChild.children);

      patchDOM(oldVNode, newVNode, root);
      const newElements = Array.from(root.firstElementChild.children);

      expect(newElements[0]).toBe(originalElements[2]); // child3
      expect(newElements[1]).toBe(originalElements[0]); // child1
      expect(newElements[2]).toBe(originalElements[1]); // child2
    });
  });

  describe('nested structures', () => {
    it('should patch deeply nested children', () => {
      const root = document.createElement('div');
      const oldVNode = createVNode('div', null, [
        createVNode('div', null, [createVNode('span', null, ['old'])]),
      ]);
      const newVNode = createVNode('div', null, [
        createVNode('div', null, [createVNode('span', null, ['new'])]),
      ]);

      mountVNode(oldVNode, root);
      patchDOM(oldVNode, newVNode, root);

      expect(root.textContent).toBe('new');
    });

    it('should handle fragment children updates', () => {
      const root = document.createElement('div');
      const oldVNode = createVNode('div', null, [
        createFragmentVNode([
          createVNode('span', null, ['old1']),
          createVNode('span', null, ['old2']),
        ]),
      ]);
      const newVNode = createVNode('div', null, [
        createFragmentVNode([
          createVNode('span', null, ['new1']),
          createVNode('span', null, ['new2']),
        ]),
      ]);

      mountVNode(oldVNode, root);
      patchDOM(oldVNode, newVNode, root);

      expect(root.textContent).toBe('new1new2');
    });
  });

  describe('component children', () => {
    it.todo('should patch children of component nodes', () => {
      const ChildComponent = defineComponent({
        render(props, { children }) {
          return createVNode('div', props, children);
        },
      });

      const root = document.createElement('div');
      const oldVNode = createVNode('div', null, [createVNode(ChildComponent, null, ['old'])]);
      const newVNode = createVNode('div', null, [createVNode(ChildComponent, null, ['new'])]);

      mountVNode(oldVNode, root);
      patchDOM(oldVNode, newVNode, root);

      expect(root.textContent).toBe('new');
    });

    it('should patch children of element nodes', () => {
      const root = document.createElement('div');
      const oldVNode = createVNode('div', null, [createVNode('span', null, ['old'])]);
      const newVNode = createVNode('div', null, [createVNode('span', null, ['new'])]);

      mountVNode(oldVNode, root);
      patchDOM(oldVNode, newVNode, root);

      expect(root.textContent).toBe('new');
    });
  });

  describe('mixed content', () => {
    it('should handle mixed text and element nodes', () => {
      const root = document.createElement('div');
      const oldVNode = createVNode('div', null, [
        'text',
        createVNode('span'),
        createTextVNode('more'),
      ]);
      const newVNode = createVNode('div', null, [
        'new',
        createVNode('span'),
        createTextVNode('updated'),
      ]);

      mountVNode(oldVNode, root);
      patchDOM(oldVNode, newVNode, root);

      const childNodes = root.firstElementChild.childNodes;
      expect(childNodes[0].textContent).toBe('new');
      expect((childNodes[1] as Element).tagName).toBe('SPAN');
      expect(childNodes[2].textContent).toBe('updated');
    });
  });
});
