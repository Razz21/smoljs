import { patchAttrs } from '@/patch-dom/patch-attrs';
import { describe, expect, it } from 'vitest';

describe('patchAttrs', () => {
  it('should add new attributes', () => {
    const el = document.createElement('div');
    patchAttrs(el, {}, { id: 'new-id', 'data-test': 'value' });
    expect(el.id).toBe('new-id');
    expect(el.getAttribute('data-test')).toBe('value');
  });

  it('should remove old attributes', () => {
    const el = document.createElement('div');
    el.setAttribute('id', 'old-id');
    el.setAttribute('data-test', 'old-value');
    
    patchAttrs(el, { id: 'old-id', 'data-test': 'old-value' }, {});
    expect(el.hasAttribute('id')).toBe(false);
    expect(el.hasAttribute('data-test')).toBe(false);
  });

  it('should update existing attributes', () => {
    const el = document.createElement('div');
    el.setAttribute('id', 'old-id');
    
    patchAttrs(el, { id: 'old-id' }, { id: 'new-id' });
    expect(el.id).toBe('new-id');
  });

  it('should handle boolean attributes', () => {
    const el = document.createElement('input');
    patchAttrs(el, {}, { disabled: true });
    expect(el.disabled).toBe(true);

    patchAttrs(el, { disabled: true }, { disabled: false });
    expect(el.disabled).toBe(false);
  });

  it('should handle null and undefined values', () => {
    const el = document.createElement('div');
    el.setAttribute('id', 'test');
    
    patchAttrs(el, { id: 'test' }, { id: null });
    expect(el.hasAttribute('id')).toBe(false);

    patchAttrs(el, {}, { id: undefined });
    expect(el.hasAttribute('id')).toBe(false);
  });

  it('should handle numeric values', () => {
    const el = document.createElement('div');
    patchAttrs(el, {}, { tabIndex: 1 });
    expect(el.getAttribute('tabindex')).toBe('1');
  });
});
