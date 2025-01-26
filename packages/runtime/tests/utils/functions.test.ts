import { noOp } from '@/utils/functions';
import { describe, expect, it } from 'vitest';

describe('utils/functions', () => {
  describe('noOp', () => {
    it('should do nothing', () => {
      expect(noOp()).toBeUndefined();
    });
  });
});
