import type { Route } from '@/types';
import { matchRoutes } from '@/utils';
import { describe, expect, test } from 'vitest';

const trees = [
  {
    path: '/',
    children: [],
  },
  {
    path: '/users',
    children: [
      {
        path: '/:id',
        children: [{ path: '/profile', children: [] }],
      },
      {
        path: '/list',
        children: [],
      },
    ],
  },
  {
    path: '/products',
    children: [
      {
        path: '/ist',
        children: [],
      },
    ],
  },
] as any as Route[];

describe('matchRoutes', () => {
  test('should find the partial matching routes in the trees', () => {
    const realPath = '/users/123';
    const matchingResult = matchRoutes(trees, realPath);

    expect(matchingResult).toEqual(
      expect.objectContaining({
        matchedRoutes: expect.arrayContaining([
          expect.objectContaining({ path: '/users' }),
          expect.objectContaining({ path: '/:id' }),
        ]),
        fullPattern: '/users/:id',
        path: '/users/123',
      })
    );
  });

  test('should find the full matching routes in the trees', () => {
    const realPath = '/users/123/profile';
    const matchingResult = matchRoutes(trees, realPath);

    expect(matchingResult).toEqual(
      expect.objectContaining({
        matchedRoutes: expect.arrayContaining([
          expect.objectContaining({ path: '/users' }),
          expect.objectContaining({ path: '/:id' }),
          expect.objectContaining({ path: '/profile' }),
        ]),
        fullPattern: '/users/:id/profile',
        path: '/users/123/profile',
      })
    );
  });

  test('should return null if no matching routes is found', () => {
    const realPath = '/users/123/details';
    const matchingResult = matchRoutes(trees, realPath);

    expect(matchingResult).toBeNull();
  });

  test("should match the root path '/'", () => {
    const realPath = '/';
    const matchingResult = matchRoutes(trees, realPath);

    expect(matchingResult).toEqual(
      expect.objectContaining({
        matchedRoutes: expect.arrayContaining([expect.objectContaining({ path: '/' })]),
        fullPattern: '/',
        path: '/',
      })
    );
  });

  test("should match the wildcard path '*foo'", () => {
    const realPath = '/custom-path';
    const matchAnyRoute = { path: '*foo', component: 'Page404' } as any as Route;

    const matchingResult = matchRoutes([...trees, matchAnyRoute], realPath);

    expect(matchingResult).toEqual(
      expect.objectContaining({
        matchedRoutes: expect.arrayContaining([matchAnyRoute]),
        fullPattern: '/*foo',
        path: realPath,
        params: { foo: ['custom-path'] },
      })
    );
  });
});
