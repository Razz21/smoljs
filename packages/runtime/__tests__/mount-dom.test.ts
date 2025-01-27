import { defineComponent } from '@/component';
import { mountVNode } from '@/mount-dom';
import { createFragmentVNode, createTextVNode, createVNode } from '@/vdom';
import { describe, expect, it } from 'vitest';

describe('mountVNode', () => {
  it('should mount a text VNode to the DOM', () => {
    const vnode = createTextVNode('Hello, world!');
    const root = document.createElement('div');

    mountVNode(vnode, root);

    expect(root.textContent).toBe('Hello, world!');
  });

  it('should mount an element VNode to the DOM', () => {
    const vnode = createVNode('div', null, ['Hello, world!']);
    const root = document.createElement('div');

    mountVNode(vnode, root);

    expect(root.children).toHaveLength(1);
    expect(root.children[0].textContent).toBe('Hello, world!');
  });

  it('should mount a fragment VNode children to the DOM', () => {
    const vnode = createFragmentVNode([
      createVNode('span', null, [createVNode('div')]),
      createVNode('p', null, ['Hello, world!']),
      null,
      'Some text',
    ]);
    const root = document.createElement('div');

    mountVNode(vnode, root);
    expect(root.children).toHaveLength(2); // ElementNodes
    expect(root.childNodes).toHaveLength(3); // ElementNodes + TextNodes
  });

  it('should mount a class component VNode to the DOM', () => {
    const Component = defineComponent({ render: () => createVNode('div') });

    const vnode = createVNode(Component);
    const root = document.createElement('div');

    mountVNode(vnode, root);

    expect(root.children).toHaveLength(1);
  });

  it('should throw an error for an invalid type', () => {
    const root = document.createElement('div');

    expect(() => mountVNode({ type: 123 } as any, root)).toThrow();
  });

  it('should mount nodes at specific index', () => {
    const root = document.createElement('div');

    mountVNode(createVNode('div'), root);
    mountVNode(createVNode('span'), root);

    const newNode = createVNode('p');
    mountVNode(newNode, root, 1);

    expect(Array.from(root.children).indexOf(newNode.el as Element)).toBe(1);
    expect(root.children).toHaveLength(3);
  });

  it('should append node when index is greater than children length', () => {
    const root = document.createElement('div');
    mountVNode(createVNode('div'), root);

    const newNode = createVNode('span');
    mountVNode(newNode, root, 999);

    expect(root.lastElementChild).toBe(newNode.el);
  });

  it('should throw error for negative index', () => {
    const root = document.createElement('div');
    const vnode = createVNode('div');

    expect(() => mountVNode(vnode, root, -1)).toThrow('Index must be a non-negative integer');
  });

  it('should handle nested fragment mounting', () => {
    const root = document.createElement('div');
    const vnode = createFragmentVNode([
      createFragmentVNode([createVNode('div'), createVNode('span')]),
      createVNode('p'),
    ]);

    mountVNode(vnode, root);

    expect(root.children).toHaveLength(3);
    expect(root.children[0].tagName).toBe('DIV');
    expect(root.children[1].tagName).toBe('SPAN');
    expect(root.children[2].tagName).toBe('P');
  });

  it('should mount component with children', () => {
    const Component = defineComponent({
      render(_, { children }) {
        return createVNode('div', null, children);
      },
    });

    const vnode = createVNode(Component, null, [createVNode('span', null, ['Child'])]);
    const root = document.createElement('div');

    mountVNode(vnode, root);

    expect(root.firstElementChild.firstElementChild.tagName).toBe('SPAN');
    expect(root.firstElementChild.firstElementChild.textContent).toBe('Child');
  });
});
