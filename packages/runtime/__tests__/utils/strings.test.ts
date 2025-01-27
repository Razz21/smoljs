import { isNonBlankString } from '@/utils/strings';
import { describe, expect, it } from 'vitest';

describe('utils/strings', () => {
  describe('isNonBlankString', () => {
    it('should return true for non-blank strings', () => {
      expect(isNonBlankString('hello')).toBe(true);
    });

    it('should return false for blank strings', () => {
      expect(isNonBlankString('   ')).toBe(false);
    });
  });
});
