import { defineComponent } from '@/component';
import { destroyVNode } from '@/destroy-dom';
import { mountVNode } from '@/mount-dom';
import { createVNode } from '@/vdom';
import { describe, expect, it, vi } from 'vitest';

describe('destroyVNode', () => {
  it('should destroy a class component VNode', () => {
    const Component = defineComponent({ render: () => null });
    const vnode = createVNode(Component);
    vnode.component = new Component();

    vnode.component.unmount = vi.fn();

    destroyVNode(vnode);
    expect(vnode.component.unmount).toHaveBeenCalled();
  });

  it('should destroy an element VNode', () => {
    const props = { on: { click: vi.fn() } };
    const vnode = createVNode('div', props);

    const root = document.createElement('div');

    mountVNode(vnode, root);

    destroyVNode(vnode);

    expect(root.children).toHaveLength(0);
    expect(vnode.listeners).toBeNull();
    expect(vnode.el.isConnected).toBeFalsy();
  });

  it('should recursively destroy child VNodes', () => {
    const childVNode = createVNode('span');
    const parentVNode = createVNode('div', null, [childVNode]);

    const root = document.createElement('div');

    mountVNode(parentVNode, root);

    destroyVNode(parentVNode);

    expect(root.children).toHaveLength(0);
    expect(parentVNode.el.childNodes).toHaveLength(0);
    expect(parentVNode.el.isConnected).toBeFalsy();
    expect(childVNode.el.isConnected).toBeFalsy();
  });

  it('should destroy a function VNode', () => {
    const FunctionComponent = () => createVNode('span');
    const vnode = createVNode(FunctionComponent);

    const root = document.createElement('div');

    mountVNode(vnode, root);
    expect(root.children).toHaveLength(1);

    destroyVNode(vnode);

    expect(root.children).toHaveLength(0);
    expect(vnode.component.el.isConnected).toBeFalsy();
  });
});
