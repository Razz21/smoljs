import { applyAttribute, applyAttributes, applyClass, applyStyle, removeStyle } from '@/attributes';
import { describe, expect, it } from 'vitest';

describe('attributes', () => {
  describe('applyClass', () => {
    it('should handle empty class name', () => {
      const el = document.createElement('div');
      el.className = 'existing';
      applyClass(el, '');
      expect(el.className).toBe('');
    });

    it('should handle array with empty strings', () => {
      const el = document.createElement('div');
      applyClass(el, ['', '  ', 'valid']);
      expect(el.className).toBe('valid');
    });

    it('should handle special characters in class names', () => {
      const el = document.createElement('div');
      applyClass(el, 'class!@#$%^&*');
      expect(el.className).toBe('class!@#$%^&*');
    });
  });

  describe('applyStyle', () => {
    it('should handle camelCase property names', () => {
      const el = document.createElement('div');
      applyStyle(el, 'backgroundColor', 'red');
      expect(el.style.getPropertyValue('background-color')).toBe('red');
    });

    it.skip('should handle vendor prefixed properties', () => {
      const el = document.createElement('div');
      applyStyle(el, 'webkitTransform', 'scale(2)');
      expect(el.style.getPropertyValue('-webkit-transform')).toBe('scale(2)');
    });

    it('should handle custom properties', () => {
      const el = document.createElement('div');
      applyStyle(el, '--customColor', 'blue');
      expect(el.style.getPropertyValue('--custom-color')).toBe('blue');
    });
  });

  describe('removeStyle', () => {
    it('should handle non-existent properties', () => {
      const el = document.createElement('div');
      expect(() => removeStyle(el, 'nonExistentProperty')).not.toThrow();
    });

    it.skip('should remove vendor prefixed properties', () => {
      const el = document.createElement('div');
      el.style.setProperty('-webkit-transform', 'scale(2)');
      removeStyle(el, 'webkitTransform');
      expect(el.style.getPropertyValue('-webkit-transform')).toBe('');
    });
  });

  describe('applyAttribute', () => {
    it('should handle boolean attributes', () => {
      const el = document.createElement('input');
      applyAttribute(el, 'disabled', true);
      expect(el.disabled).toBe(true);
    });

    it('should handle data attributes with special characters', () => {
      const el = document.createElement('div');
      applyAttribute(el, 'data-test!@#', 'value');
      expect(el.getAttribute('data-test!@#')).toBe('value');
    });

    it('should handle numeric values', () => {
      const el = document.createElement('div');
      applyAttribute(el, 'tabIndex', 1);
      expect(el.getAttribute('tabindex')).toBe('1');
    });

    it('should handle null values for boolean attributes', () => {
      const el = document.createElement('input');
      el.disabled = true;
      applyAttribute(el, 'disabled', null);
      expect(el.disabled).toBe(false);
    });
  });

  describe('applyAttributes', () => {
    it('should handle all attribute types simultaneously', () => {
      const el = document.createElement('div');
      applyAttributes(el, {
        class: ['test-class'],
        style: { color: 'red' },
        id: 'test-id',
        'data-test': 'value',
      });

      expect(el.className).toBe('test-class');
      expect(el.style.color).toBe('red');
      expect(el.id).toBe('test-id');
      expect(el.getAttribute('data-test')).toBe('value');
    });

    it('should handle empty objects', () => {
      const el = document.createElement('div');
      expect(() => applyAttributes(el, {})).not.toThrow();
    });

    it('should handle undefined attributes', () => {
      const el = document.createElement('div');
      applyAttributes(el, {
        class: undefined,
        style: undefined,
        id: undefined,
      } as any);

      expect(el.className).toBe('');
      expect(el.style.cssText).toBe('');
      expect(el.id).toBe('');
    });
  });
});
