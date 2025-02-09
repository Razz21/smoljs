import type { ComponentInstance, FunctionComponent } from '@smoljs/runtime';
import type { ParsedQuery } from 'query-string';

export type RoutePath = string;

export interface Route<T extends RoutePath = RoutePath> {
  path: T;
  component: ComponentInstance | FunctionComponent<any>;
  children?: Route<T>[];
}

export type ResolvedRoute = {
  matchedRoutes: Route[];
  pathname: string;
  params: Record<string, string | string[]>;
  search?: ParsedQuery<string>;
  path: string;
  fullPath: string;
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
  ? [string]
  : S extends ''
    ? []
    : S extends `${infer T}${D}${infer U}`
      ? [...Split<T, D>, ...Split<U, D>]
      : [S];

export type PathParams<TPath extends string> = {
  [K in Split<TPath, '/'>[number] as K extends `:${infer Param}` ? Param : never]: string;
};

export type PathObject<T extends string> = {
  pathname: T;
  params?: PathParams<T>;
  search?: Record<string, string | string[]>;
};
