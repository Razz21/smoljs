import { normalizeChildren, toVNode } from '@/vdom/helpers';
import { createTextVNode, createVNode, isVNode } from '@/vdom/vnode';
import { describe, expect, it } from 'vitest';

describe('vdom/helpers', () => {
  describe('normalizeChildren', () => {
    it('should normalize children to VNodes', () => {
      const children = [1, '2', true, null, undefined, void 0];
      const normalized = normalizeChildren(children);
      expect(normalized).toHaveLength(3);
      expect(normalized.every(isVNode)).toBe(true);
    });

    it('should handle single child', () => {
      const child = 'single';
      const normalized = normalizeChildren(child);
      expect(normalized).toHaveLength(1);
      expect(isVNode(normalized[0])).toBe(true);
    });

    it('should handle vnode children', () => {
      const children = [createTextVNode('1'), createVNode('div')];
      const normalized = normalizeChildren(children);
      expect(normalized).toHaveLength(2);
      expect(normalized).toEqual(children);
    });
  });

  describe('toVNode', () => {
    it('should convert mixed children to VNodes', () => {
      const children = [1, '2', true];
      const vnodes = toVNode(children);
      expect(vnodes).toHaveLength(3);
      expect(vnodes.every(isVNode)).toBe(true);
    });

    it('should handle empty array', () => {
      const children: any[] = [];
      const vnodes = toVNode(children);
      expect(vnodes).toHaveLength(0);
    });

    it('should convert non-VNode children to TextVNode', () => {
      const children = [1, '2', true];
      const vnodes = toVNode(children);
      vnodes.forEach((vnode, index) => {
        expect(vnode.type).toBe(createTextVNode('').type);
        expect(vnode.props.nodeValue).toBe(String(children[index]));
      });
    });
  });
});
