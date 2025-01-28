import type { GeneratePathsFromRoutes, ResolvedRoute, Route, RouterOptions } from './types';

// Core Router Class
export class RouterClass<TRoutes extends Route[], TPath extends GeneratePathsFromRoutes<TRoutes>> {
  private _routes: TRoutes = [] as TRoutes;
  private _currentRoute?: ResolvedRoute<string>;
  private _subscriptions = new Set<
    (prevRoute: ResolvedRoute<string> | undefined, currentRoute: ResolvedRoute<string>) => void
  >();

  constructor(options: RouterOptions<TRoutes>) {
    this._routes = options.routes;
  }

  get routes(): TRoutes {
    return this._routes;
  }

  get currentRoute(): ResolvedRoute<string> | undefined {
    return this._currentRoute;
  }

  init(): void {
    this._renderRoute(window.location.pathname);

    window.addEventListener('popstate', () => {
      this._renderRoute(window.location.pathname);
    });
  }

  push(path: TPath | (string & {})): void {
    window.history.pushState({}, '', path);
    this._renderRoute(path);
  }

  replace(path: TPath | (string & {})): void {
    window.history.replaceState({}, '', path);
    this._renderRoute(path);
  }

  subscribe(
    callback: (
      prevRoute: ResolvedRoute<TPath> | undefined,
      currentRoute: ResolvedRoute<TPath>
    ) => void
  ): () => void {
    this._subscriptions.add(callback);
    return () => {
      this._subscriptions.delete(callback);
    };
  }

  private _renderRoute(path: string): void {
    const matchedRoutes = this.resolveRoute(path);

    if (matchedRoutes.length === 0) {
      throw new Error(`Route not found: ${path}`);
    }

    const prevRoute = this._currentRoute;

    const currentRoute = Object.assign({}, matchedRoutes.at(0), {
      matchedRoutes,
      path,
    });

    this._currentRoute = currentRoute;
    this._subscriptions.forEach((callback) => callback(prevRoute, this._currentRoute));
  }

  resolveRoute(path: string): Route[] {
    // TODO: Implement strict route matching
    // FIXME  "/invalid" fallbacks to the root "/" path
    const matchedRoutes: Route[] = [];

    const matchRoute = (routes: Route<any>[], segments: string[]): boolean => {
      for (const route of routes) {
        const routeSegments = route.path.split('/').filter(Boolean);

        if (
          segments.length >= routeSegments.length &&
          routeSegments.every((seg, index) => seg === segments[index])
        ) {
          matchedRoutes.push(route);

          const remainingSegments = segments.slice(routeSegments.length);
          if (remainingSegments.length > 0 && route.children) {
            return matchRoute(route.children, remainingSegments);
          }

          return true;
        }
      }
      return false;
    };

    matchRoute(this._routes, path.split('/').filter(Boolean));
    return matchedRoutes as Route<string>[];
  }
}

// Global router instance
let activeRouter: RouterClass<any, any>;

export function useRouter(): RegisteredRouter {
  if (!activeRouter) {
    throw new Error('Router is not initialized. Please create a router instance first.');
  }
  return activeRouter;
}

export function createRouter<TRoutes extends Route[]>(options: RouterOptions<TRoutes>) {
  const router = new RouterClass(options);
  activeRouter = router;
  return router;
}

// Type for manual declaration merging
export interface Register {
  // router
}
export type AnyRouter = RouterClass<any, any>;

export type RegisteredRouter = Register extends {
  router: infer TRouter extends AnyRouter;
}
  ? TRouter
  : AnyRouter;
