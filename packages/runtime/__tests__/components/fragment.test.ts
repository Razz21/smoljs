import { Fragment } from '@/components/fragment';
import { hFragment } from '@/h';
import { describe, expect, it } from 'vitest';

describe('components/fragment', () => {
  it('should render children as a fragment', () => {
    const children = ['child1', 'child2'];
    const fragment = Fragment({}, { children });
    expect(fragment).toEqual(hFragment(children));
  });

  it('should handle empty children', () => {
    const children: any[] = [];
    const fragment = Fragment({}, { children });
    expect(fragment).toEqual(hFragment(children));
  });

  it('should handle single child', () => {
    const child = 'single';
    const fragment = Fragment({}, { children: [child] });
    expect(fragment).toEqual(hFragment([child]));
  });
});
