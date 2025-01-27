import { patchStyles } from '@/patch-dom/patch-styles';
import { describe, expect, it } from 'vitest';

describe('patchStyles', () => {
  it('should add new styles', () => {
    const el = document.createElement('div');
    patchStyles(el, {}, { color: 'red', 'fontSize': '12px' });
    expect(el.style.color).toBe('red');
    expect(el.style.fontSize).toBe('12px');
  });

  it('should remove old styles', () => {
    const el = document.createElement('div');
    el.style.color = 'red';
    el.style.fontSize = '12px';
    
    patchStyles(el, { color: 'red', fontSize: '12px' }, {});
    expect(el.style.color).toBe('');
    expect(el.style.fontSize).toBe('');
  });

  it('should update existing styles', () => {
    const el = document.createElement('div');
    el.style.color = 'red';
    
    patchStyles(el, { color: 'red' }, { color: 'blue' });
    expect(el.style.color).toBe('blue');
  });

  it('should handle empty style objects', () => {
    const el = document.createElement('div');
    patchStyles(el, {}, {});
    expect(el.getAttribute('style')).toBeNull();
  });

  it('should handle invalid style values', () => {
    const el = document.createElement('div');
    patchStyles(el, {}, { color: undefined as any });
    expect(el.style.color).toBe('');
  });
});
