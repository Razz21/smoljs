import { defineComponent } from '@/component';
import { h, hFragment } from '@/h';
import { createFragmentVNode, createVNode } from '@/vdom';
import { describe, expect, it } from 'vitest';

describe('h', () => {
  it('should create a VNode for a string type', () => {
    const vnode = h('div', { id: 'test' }, ['Hello']);
    expect(vnode).toMatchObject(createVNode('div', { id: 'test' }, ['Hello']));
  });

  it('should create a VNode for a class component', () => {
    const TestComponent = defineComponent<any, any, any>({ render: () => null });
    const vnode = h(TestComponent, { prop: 'value' }, ['Child']);
    expect(vnode).toMatchObject(createVNode(TestComponent, { prop: 'value' }, ['Child']));
  });

  it('should create a VNode for a function component', () => {
    const TestComponent = (props: any, children: any) => createVNode('span', props, children);
    const vnode = h(TestComponent, { prop: 'value' }, ['Child']);
    expect(vnode).toMatchObject(TestComponent({ prop: 'value' }, { children: ['Child'] }));
  });

  it('should throw an error for an invalid type', () => {
    expect(() => h(123 as any)).toThrow('Invalid component type passed to "h"');
  });
});

describe('hFragment', () => {
  it('should create a fragment VNode', () => {
    const vNodes = [createVNode('div'), createVNode('span')];
    const fragmentVNode = hFragment(vNodes);
    expect(fragmentVNode).toEqual(createFragmentVNode(vNodes));
  });
});
