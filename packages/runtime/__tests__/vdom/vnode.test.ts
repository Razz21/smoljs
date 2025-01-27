import { defineComponent } from '@/component';
import {
  FragmentVNode,
  TextVNode,
  createFragmentVNode,
  createTextVNode,
  createVNode,
  isClassComponentVNode,
  isElementVNode,
  isFragmentVNode,
  isTextVNode,
  isVNode,
} from '@/vdom';
import { describe, expect, it } from 'vitest';

describe('vdom/vnode', () => {
  it('should create a VNode', () => {
    const vnode = createVNode('div');
    expect(vnode).toMatchObject({
      _isVNode: true,
      type: 'div',
      props: {},
      children: [],
      el: null,
      ref: null,
      listeners: null,
      component: null,
    });
  });

  it('should create a VNode with a ref', () => {
    const vnode = createVNode('div', { ref: 'ref' });
    expect(vnode).toMatchObject({
      _isVNode: true,
      type: 'div',
      props: {},
      children: [],
      el: null,
      ref: 'ref',
      listeners: null,
      component: null,
    });
  });

  it('should create a TextVNode', () => {
    const textVNode = createTextVNode('Hello');
    expect(textVNode).toMatchObject({
      _isVNode: true,
      type: TextVNode,
      props: { nodeValue: 'Hello' },
      children: [],
      el: null,
      ref: null,
      listeners: null,
      component: null,
    });
  });

  it('should create a FragmentVNode', () => {
    const fragmentVNode = createFragmentVNode([]);
    expect(fragmentVNode).toMatchObject({
      _isVNode: true,
      type: FragmentVNode,
      props: {},
      children: [],
      el: null,
      ref: null,
      listeners: null,
      component: null,
    });
  });

  it.each([
    [createVNode('div'), true],
    [createVNode(defineComponent({ render() {} })), true],
    [createTextVNode('Hello'), true],
    [createFragmentVNode([]), true],
    [{}, false],
    [null, false],
  ])('isVNode(%o) should be %s', (value, expected) => {
    expect(isVNode(value)).toBe(expected);
  });

  it.each([
    [createTextVNode('Hello'), true],
    [createVNode(defineComponent({ render() {} })), false],
    [createVNode('div'), false],
  ])('isTextVNode(%o) should be %s', (value, expected) => {
    expect(isTextVNode(value)).toBe(expected);
  });

  it.each([
    [createFragmentVNode([]), true],
    [createVNode(defineComponent({ render() {} })), false],
    [createVNode('div'), false],
    [createTextVNode('Hello'), false],
  ])('isFragmentVNode(%o) should be %s', (value, expected) => {
    expect(isFragmentVNode(value)).toBe(expected);
  });

  it.each([
    [createVNode('div'), true],
    [createVNode(defineComponent({ render() {} })), false],
    [createTextVNode('Hello'), false],
    [createFragmentVNode([]), false],
  ])('isElementVNode(%o) should be %s', (value, expected) => {
    expect(isElementVNode(value)).toBe(expected);
  });

  it.each([
    [createVNode(defineComponent({ render() {} })), true],
    [createVNode('div'), false],
    [createTextVNode('Hello'), false],
    [createFragmentVNode([]), false],
  ])('isElementVNode(%o) should be %s', (value, expected) => {
    expect(isClassComponentVNode(value)).toBe(expected);
  });
});
