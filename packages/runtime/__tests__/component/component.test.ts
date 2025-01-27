import { Component } from '@/component/component';
import { createFragmentVNode, createVNode } from '@/vdom';
import { describe, expect, it, vi } from 'vitest';

class TestComponent extends Component<any, any> {
  render() {
    return createVNode('div');
  }
  onMounted = vi.fn();
  onUnmounted = vi.fn();
  onUpdated = vi.fn();
}

describe('component/component', () => {
  it('should mount the component', () => {
    const instance = new TestComponent();
    const hostEl = document.createElement('div');
    instance.mount(hostEl);
    expect(instance.firstElement).toBe(hostEl.firstChild);
    expect(instance.onMounted).toHaveBeenCalled();
  });

  it('should unmount the component', () => {
    const instance = new TestComponent();
    const hostEl = document.createElement('div');
    instance.mount(hostEl);
    instance.unmount();
    expect(instance.firstElement).toBeNull();
    expect(instance.onUnmounted).toHaveBeenCalled();
  });

  it('should update props', () => {
    const instance = new TestComponent();
    const hostEl = document.createElement('div');
    instance.mount(hostEl);
    instance.updateProps({ newProp: 'value' });
    expect(instance.props.newProp).toBe('value');
    expect(instance.onUpdated).toHaveBeenCalled();
  });

  it('should update state', () => {
    const instance = new TestComponent();
    const hostEl = document.createElement('div');
    instance.mount(hostEl);
    instance.updateState({ newState: 'value' });
    expect(instance.state.newState).toBe('value');
    expect(instance.onUpdated).toHaveBeenCalled();
  });

  it('should not update state on duplicate value', () => {
    const instance = new TestComponent();
    const hostEl = document.createElement('div');
    instance.mount(hostEl);
    instance.updateState({ newState: 'value' });
    instance.updateState(() => ({ newState: 'value' }));
    expect(instance.state.newState).toBe('value');
    expect(instance.onUpdated).toHaveBeenCalledOnce();
  });

  it('should handle refs', () => {
    const instance = new TestComponent();
    const hostEl = document.createElement('div');
    const vnode = createVNode('div', { ref: 'testRef' });
    instance.render = () => vnode;
    instance.mount(hostEl);
    expect(instance.$refs.testRef).toBe(hostEl.firstChild);
  });

  it('should not update on duplicate props', () => {
    const instance = new TestComponent({ prop: 'value' });
    const hostEl = document.createElement('div');
    const vnode = createVNode('div');
    instance.render = () => vnode;
    instance.mount(hostEl);

    instance.updateProps({ prop: 'value' });
    expect(instance.onUpdated).not.toHaveBeenCalled();
  });

  it('should update on different props', () => {
    const instance = new TestComponent({ prop: 'value' });
    const hostEl = document.createElement('div');
    const vnode = createVNode('div');
    instance.render = () => vnode;
    instance.mount(hostEl);

    instance.updateProps({ prop: 'other-value' });
    expect(instance.onUpdated).toHaveBeenCalled();
  });

  it('should return fragment vnode elements', () => {
    const instance = new TestComponent({ prop: 'value' });
    const hostEl = document.createElement('div');
    const vnode = createVNode('div');
    const vnode1 = createVNode('span');
    const fragment = createFragmentVNode([vnode, vnode1]);
    instance.render = () => fragment;
    instance.mount(hostEl);

    expect(instance.elements).toEqual([vnode.el, vnode1.el]);
  });

  it('should throw error updating state of not mounted component', () => {
    const instance = new TestComponent();

    expect(() => instance.updateProps({ newProp: 'value' })).toThrowError(
      'Component is not mounted'
    );
  });

  it('should throw error when unmounting not mounted component', () => {
    const instance = new TestComponent();

    expect(() => instance.unmount()).toThrowError('Component is not mounted');
  });

  it('should throw error when mounting already mounted component', () => {
    const instance = new TestComponent();
    const hostEl = document.createElement('div');
    const vnode = createVNode('div', { ref: 'testRef' });
    instance.render = () => vnode;
    instance.mount(hostEl);

    expect(() => instance.mount(hostEl)).toThrowError('Component is already mounted');
  });

  it('should throw error when mounting already mounted component', () => {
    const instance = new TestComponent();
    const hostEl = document.createElement('div');
    const vnode = createVNode('div', { ref: 'testRef' });
    instance.render = () => vnode;
    instance.mount(hostEl);

    expect(() => instance.mount(hostEl)).toThrowError('Component is already mounted');
  });

  it('should return correct offset for single element vnode', () => {
    const instance = new TestComponent();
    const hostEl = document.createElement('div');
    const vnode = createVNode('div');
    instance.render = () => vnode;
    instance.mount(hostEl);
    expect(instance.offset).toBe(0);
  });

  it('should return correct offset for fragment vnode', () => {
    const instance = new TestComponent();
    const hostEl = document.createElement('div');
    const vnode1 = createVNode('div');
    const vnode2 = createVNode('span');
    const fragment = createFragmentVNode([vnode1, vnode2]);
    instance.render = () => fragment;
    instance.mount(hostEl);
    expect(instance.offset).toBe(Array.from(hostEl.childNodes).indexOf(vnode1.el));
  });
});
