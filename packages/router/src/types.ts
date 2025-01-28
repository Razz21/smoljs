import type { ComponentInstance, FunctionComponent } from '@smoljs/runtime';

export type RoutePath = string;

export interface Route<T extends RoutePath = RoutePath> {
  path: T;
  component: ComponentInstance | FunctionComponent<any>;
  children?: Route[];
}

export type ResolvedRoute<TPath extends RoutePath> = Route<TPath> & {
  matchedRoutes: Route<TPath>[];
};

export type RouterOptions<TRoutes extends Route[]> = { routes: TRoutes };

export type GeneratePathsFromRoutes<T extends Route[]> = T extends [
  infer Head extends Route,
  ...infer Tail extends Route[],
]
  ? GeneratePaths<Head> | GeneratePathsFromRoutes<Tail>
  : never;

export type GeneratePaths<T extends Route, TPrefix extends string = ''> = T extends {
  path: infer P extends string;
  children?: infer C extends Route[];
}
  ? C extends Route[]
    ? `${TPrefix}${P}` | GeneratePathsFromChildren<C, `${TPrefix}${P}`>
    : `${TPrefix}${P}`
  : never;

type GeneratePathsFromChildren<
  TChildren extends Route[],
  TPrefix extends string,
> = TChildren extends [infer Head extends Route, ...infer Tail extends Route[]]
  ? GeneratePaths<Head, `${TPrefix}`> | GeneratePathsFromChildren<Tail, `${TPrefix}`>
  : never;
