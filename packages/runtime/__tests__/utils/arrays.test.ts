import { calculateArrayDifference, filterNonNullable, generateArrayTransformationSequence } from '@/utils/arrays';
import { describe, expect, it } from 'vitest';

describe('utils/arrays', () => {
  describe('filterNonNullable', () => {
    it('should filter out null and undefined values', () => {
      const arr = [1, null, 2, undefined, 3];
      expect(filterNonNullable(arr)).toEqual([1, 2, 3]);
    });
  });

  describe('calculateArrayDifference', () => {
    it('should return correct difference', () => {
      const originalArray = [1, 2, 3];
      const updatedArray = [2, 3, 4];
      expect(calculateArrayDifference(originalArray, updatedArray)).toEqual({
        added: [4],
        removed: [1],
      });
    });
  });

  describe('generateArrayTransformationSequence', () => {
    const testCases = [
      {
        description: 'should return correct transformation sequence for addition',
        originalArray: [1, 2, 3],
        updatedArray: [1, 2, 3, 4],
        expected: [
          { op: 'noop', index: 0, item: 1, originalIndex: 0 },
          { op: 'noop', index: 1, item: 2, originalIndex: 1 },
          { op: 'noop', index: 2, item: 3, originalIndex: 2 },
          { op: 'add', index: 3, item: 4 },
        ],
      },
      {
        description: 'should return correct transformation sequence for removal',
        originalArray: [1, 2, 3],
        updatedArray: [1, 3],
        expected: [
          { op: 'noop', index: 0, item: 1, originalIndex: 0 },
          { op: 'remove', index: 1, item: 2, originalIndex: 1 },
          { op: 'noop', index: 1, item: 3, originalIndex: 2 },
        ],
      },
      {
        description: 'should return correct transformation sequence for move',
        originalArray: [1, 2, 3],
        updatedArray: [3, 1, 2],
        expected: [
          { op: 'move', from: 2, index: 0, item: 3, originalIndex: 2 },
          { op: 'noop', index: 1, item: 1, originalIndex: 0 },
          { op: 'noop', index: 2, item: 2, originalIndex: 1 },
        ],
      },
      {
        description: 'should return correct transformation sequence for mixed operations',
        originalArray: [1, 2, 3],
        updatedArray: [3, 1, 4],
        expected: [
          { op: 'move', from: 2, index: 0, item: 3, originalIndex: 2 },
          { op: 'noop', index: 1, item: 1, originalIndex: 0 },
          { op: 'remove', index: 2, item: 2, originalIndex: 1 },
          { op: 'add', index: 2, item: 4 },
        ],
      },
    ];

    testCases.forEach(({ description, originalArray, updatedArray, expected }) => {
      it(description, () => {
        const compareFn = (a, b) => a === b;
        const sequence = generateArrayTransformationSequence(originalArray, updatedArray, compareFn);
        expect(sequence).toEqual(expected);
      });
    });
  });
});
