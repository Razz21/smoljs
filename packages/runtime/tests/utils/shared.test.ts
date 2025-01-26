import { extractChildNodes } from '@/utils/shared';
import { createFragmentVNode, createTextVNode, createVNode } from '@/vdom';
import { describe, expect, it } from 'vitest';

describe('utils/shared', () => {
  describe('extractChildNodes', () => {
    it('should return empty array for text VNode', () => {
      const vnode = createTextVNode('text');
      expect(extractChildNodes(vnode)).toEqual([]);
    });

    it('should return child nodes for element VNode', () => {
      const child1 = createVNode('div');
      const child2 = createVNode('span');
      const vnode = createVNode('div', null, [child1, child2]);
      expect(extractChildNodes(vnode)).toEqual([child1, child2]);
    });

    it('should flatten fragment VNode children', () => {
      const child1 = createVNode('div');
      const child2 = createVNode('span');
      const child3 = createVNode('p');
      const fragment = createFragmentVNode([child1, child2]);
      const vnode = createVNode('div', null, [fragment, child3]);
      expect(extractChildNodes(vnode)).toEqual([child1, child2, child3]);
    });
  });
});
