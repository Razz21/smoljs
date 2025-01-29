import { afterEach } from 'node:test';
import { RouterClass, createRouter, useRouter } from '@/router';
import type { Route } from '@/types';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('RouterClass', () => {
  const routes = [
    { path: '/', component: 'Home' },
    { path: '/about', component: 'About' },
    {
      path: '/nested',
      component: 'Nested',
      children: [{ path: '/child', component: 'NestedChild' }],
    },
    {
      path: '/dynamic',
      component: 'Dynamic',
      children: [{ path: '/:id', component: 'DynamicId' }],
    },
  ] as any satisfies Route[];

  let router: RouterClass<Route[]>;

  beforeEach(() => {
    window.history.replaceState({}, '', '/');
    router = new RouterClass({ routes });
    router.init();
  });

  afterEach(() => {
    router.cleanup();
    vi.restoreAllMocks();
    window.history.replaceState({}, '', '/');
  });

  it('should render the route on init', () => {
    expect(router.currentRoute).toMatchObject({
      path: '/',
      fullPattern: '/',
      matchedRoutes: [{ path: '/', component: 'Home' }],
      params: {},
    });
  });

  it('should push a new route', () => {
    router.push('/about');

    expect(router.currentRoute).toMatchObject({
      path: '/about',
      fullPattern: '/about',
      matchedRoutes: [{ path: '/about', component: 'About' }],
      params: {},
    });
  });

  it('should push a new route with a path object', () => {
    router.push({ pathname: '/about', params: {} });

    expect(router.currentRoute).toMatchObject({
      path: '/about',
      fullPattern: '/about',
      matchedRoutes: [{ path: '/about', component: 'About' }],
      params: {},
    });
  });

  it('should push a nested route', () => {
    router.push('/nested/child');

    expect(router.currentRoute).toMatchObject({
      path: '/nested/child',
      fullPattern: '/nested/child',
      matchedRoutes: [
        {
          path: '/nested',
          component: 'Nested',
          children: [{ path: '/child', component: 'NestedChild' }],
        },
        { path: '/child', component: 'NestedChild' },
      ],
      params: {},
    });
  });

  it('should push a dynamic route', () => {
    const id = '1234';
    const path = `/dynamic/${id}`;
    router.push(path);

    expect(router.currentRoute).toMatchObject({
      path: path,
      fullPattern: '/dynamic/:id',
      matchedRoutes: [
        {
          path: '/dynamic',
          component: 'Dynamic',
          children: [{ path: '/:id', component: 'DynamicId' }],
        },
        { path: '/:id', component: 'DynamicId' },
      ],
      params: { id },
    });
  });

  it('should push a dynamic route with router object', () => {
    const id = '1234';
    const path = `/dynamic/${id}`;
    router.push({ pathname: '/dynamic/:id', params: { id } });

    expect(router.currentRoute).toMatchObject({
      path: path,
      fullPattern: '/dynamic/:id',
      matchedRoutes: [
        {
          path: '/dynamic',
          component: 'Dynamic',
          children: [{ path: '/:id', component: 'DynamicId' }],
        },
        { path: '/:id', component: 'DynamicId' },
      ],
      params: { id },
    });
  });

  it('should handle navigation history correctly', () => {
    router.push('/about');
    router.push('/nested/child');
    router.push('/dynamic/123');

    // Simulate browser back button
    window.history.back();
    window.dispatchEvent(new Event('popstate'));

    expect(router.currentRoute).toMatchObject({
      path: '/nested/child',
      fullPattern: '/nested/child',
      matchedRoutes: [
        { path: '/nested', component: 'Nested' },
        { path: '/child', component: 'NestedChild' },
      ],
      params: {},
    });

    window.history.back();
    window.dispatchEvent(new PopStateEvent('popstate'));

    expect(router.currentRoute).toMatchObject({
      path: '/about',
      fullPattern: '/about',
      matchedRoutes: [{ path: '/about', component: 'About' }],
      params: {},
    });
  });

  it('should maintain correct navigation state after replace', () => {
    router.push('/about');
    router.replace({ pathname: '/nested/child', params: {} });

    window.history.back();
    window.dispatchEvent(new Event('popstate'));

    expect(router.currentRoute).toMatchObject({
      path: '/',
      fullPattern: '/',
      matchedRoutes: [{ path: '/', component: 'Home' }],
      params: {},
    });
  });

  it('should handle multiple subscribers correctly', () => {
    const callback1 = vi.fn();
    const callback2 = vi.fn();

    router.subscribe(callback1);
    router.subscribe(callback2);

    router.push('/about');

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  it('should unsubscribe from route changes', () => {
    const callback = vi.fn();
    const unsubscribe = router.subscribe(callback);

    router.push('/about');
    expect(callback).toHaveBeenCalledTimes(1);

    unsubscribe();
    router.push('/nested/child');
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should throw on invalid route navigation', () => {
    expect(() => router.push('/invalid')).toThrow('Route not found: /invalid');

    expect(() => router.replace('/invalid')).toThrow('Route not found: /invalid');
  });

  it('should cleanup popstate event', () => {
    const removeListenerSpy = vi.spyOn(window, 'removeEventListener');

    router.cleanup();

    expect(removeListenerSpy).toHaveBeenCalledWith('popstate', expect.any(Function));

    expect(removeListenerSpy).toHaveBeenCalledTimes(1);
  });
});

describe('useRouter', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('should throw error when router is not initialized', () => {
    expect(() => useRouter()).toThrow(
      'Router is not initialized. Please create a router instance first.'
    );
  });

  it('should return active router instance when initialized', () => {
    const routes = [{ path: '/', component: 'Home' }] as any as Route[];
    const router = createRouter({ routes });

    const activeRouter = useRouter();
    expect(activeRouter).toBe(router);
  });
});

describe('createRouter', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('should create router instance with provided routes', () => {
    const routes = [{ path: '/', component: 'Home' }] as any as Route[];
    const router = createRouter({ routes });

    expect(router).toBeInstanceOf(RouterClass);
    expect(router.routes).toEqual(routes);
  });

  it('should set created router as active router', () => {
    const routes = [{ path: '/', component: 'Home' }] as any as Route[];
    const router = createRouter({ routes });

    expect(useRouter()).toBe(router);
  });

  it('should override previous active router when creating new instance', () => {
    const routes1 = [{ path: '/', component: 'Home1' }] as any as Route[];
    const routes2 = [{ path: '/', component: 'Home2' }] as any as Route[];

    const router1 = createRouter({ routes: routes1 });
    const router2 = createRouter({ routes: routes2 });

    expect(useRouter()).toBe(router2);
    expect(useRouter()).not.toBe(router1);
  });
});
