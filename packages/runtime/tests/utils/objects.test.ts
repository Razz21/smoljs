import { hasOwnProperty, objectsDiff } from '@/utils/objects';
import { describe, expect, it } from 'vitest';

describe('utils/objects', () => {
  describe('objectsDiff', () => {
    it('should return correct diff', () => {
      const oldObj = { a: 1, b: 2 };
      const newObj = { b: 2, c: 3 };
      expect(objectsDiff(oldObj, newObj)).toEqual({
        added: ['c'],
        removed: ['a'],
        updated: [],
      });
    });
  });

  describe('hasOwnProperty', () => {
    it('should return true for existing property', () => {
      const obj = { a: 1 };
      expect(hasOwnProperty(obj, 'a')).toBe(true);
    });

    it('should return false for non-existing property', () => {
      const obj = { a: 1 };
      expect(hasOwnProperty(obj, 'b')).toBe(false);
    });
  });
});
