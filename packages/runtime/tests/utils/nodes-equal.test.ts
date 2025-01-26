import { defineComponent } from '@/component';
import { areVNodeNodesEqual } from '@/utils/nodes-equal';
import { createVNode } from '@/vdom';
import { describe, expect, it } from 'vitest';

const MyComponent = defineComponent({ render: () => null });
const MyComponentB = defineComponent({ render: () => null });

describe('utils/nodes-equal', () => {
  describe('areVNodeNodesEqual', () => {
    const testCases = [
      {
        description: 'should return true for identical VNodes',
        vnodeA: createVNode('div', { key: '1' }),
        vnodeB: createVNode('div', { key: '1' }),
        expected: true,
      },
      {
        description: 'should return false for different type VNodes',
        vnodeA: createVNode('div'),
        vnodeB: createVNode('span'),
        expected: false,
      },
      {
        description: 'should return false for different key VNodes',
        vnodeA: createVNode('div', { key: '1' }),
        vnodeB: createVNode('div', { key: '2' }),
        expected: false,
      },
      {
        description: 'should return true for identical component VNodes',
        vnodeA: createVNode(MyComponent, { key: '1' }),
        vnodeB: createVNode(MyComponent, { key: '1' }),
        expected: true,
      },
      {
        description: 'should return false for different component VNodes',
        vnodeA: createVNode(MyComponent),
        vnodeB: createVNode(MyComponentB),
        expected: false,
      },
      {
        description: 'should return false for different key component VNodes',
        vnodeA: createVNode(MyComponent, { key: '1' }),
        vnodeB: createVNode(MyComponent, { key: '2' }),
        expected: false,
      },
    ];

    testCases.forEach(({ description, vnodeA, vnodeB, expected }) => {
      it(description, () => {
        expect(areVNodeNodesEqual(vnodeA, vnodeB)).toBe(expected);
      });
    });
  });
});
