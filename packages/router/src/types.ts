import type { ComponentInstance, FunctionComponent } from '@smoljs/runtime';

export type RoutePath = string;

export interface Route<T extends RoutePath = RoutePath> {
  path: T;
  component: ComponentInstance | FunctionComponent<any>;
  children?: Route<T>[];
}

export type ResolvedRoute = {
  matchedRoutes: Route[];
  fullPattern: string;
  params: Record<string, string | string[]>;
  path: string;
};

export type RouterOptions<TRoutes extends Route[]> = { routes: TRoutes };

type NormalizePath<P extends string> = P extends `/${infer Rest}` ? `/${Rest}` : `/${P}`;

type ExtractPathsHelper<
  T extends readonly Route[],
  Prefix extends string = '',
  Depth extends readonly unknown[] = [],
> = Depth['length'] extends 30 // Suppresses TS Limit recursion depth error
  ? never
  : T extends readonly (infer R)[]
    ? R extends Route
      ?
          | `${Prefix}${NormalizePath<R['path']>}`
          | (R['children'] extends readonly Route[]
              ? ExtractPathsHelper<
                  R['children'],
                  `${Prefix}${NormalizePath<R['path']>}`,
                  [...Depth, unknown]
                >
              : never)
      : never
    : never;

export type ExtractPaths<T extends readonly Route[]> = ExtractPathsHelper<T, ''>;

type Split<S extends string, D extends string> = string extends S
  ? string
  : S extends ''
    ? never
    : S extends `${infer T}${D}${infer U}`
      ? T | Split<U, D>
      : S;

type InferDynamicString<T extends string> = T extends `:${infer V}` ? V : never;

export type PathParams<TPath extends string> = Record<InferDynamicString<Split<TPath, '/'>>, string>;
