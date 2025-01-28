import { patchClasses } from '@/patch-dom/patch-classes';
import { describe, expect, it } from 'vitest';

describe('patchClasses', () => {
  it('should add new classes', () => {
    const el = document.createElement('div');
    patchClasses(el, [], ['new-class']);
    expect(el.classList.contains('new-class')).toBe(true);
  });

  it('should remove old classes', () => {
    const el = document.createElement('div');
    el.classList.add('old-class');
    patchClasses(el, ['old-class'], []);
    expect(el.classList.contains('old-class')).toBe(false);
  });

  it('should handle string input', () => {
    const el = document.createElement('div');
    patchClasses(el, 'old-class1 old-class2', 'new-class1 new-class2');
    expect(el.classList.contains('old-class1')).toBe(false);
    expect(el.classList.contains('new-class1')).toBe(true);
  });

  it('should handle empty inputs', () => {
    const el = document.createElement('div');
    el.classList.add('test');
    patchClasses(el, '', '');
    expect(el.classList.length).toBe(0);
  });

  it('should handle whitespace and invalid classes', () => {
    const el = document.createElement('div');
    patchClasses(el, ['  ', '', 'valid'], ['new', '   ', '']);
    expect(el.classList.contains('valid')).toBe(false);
    expect(el.classList.contains('new')).toBe(true);
    expect(el.classList.length).toBe(1);
  });

  it('should preserve unchanged classes', () => {
    const el = document.createElement('div');
    el.classList.add('preserve');
    patchClasses(el, ['preserve', 'remove'], ['preserve', 'add']);
    expect(el.classList.contains('preserve')).toBe(true);
    expect(el.classList.contains('remove')).toBe(false);
    expect(el.classList.contains('add')).toBe(true);
  });
});
