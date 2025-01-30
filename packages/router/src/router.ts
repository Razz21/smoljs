import { compile } from 'path-to-regexp';
import queryString from 'query-string';
import type { ExtractPaths, PathObject, ResolvedRoute, Route, RouterOptions } from './types';
import { matchRoutes } from './utils';

// Core Router Class
export class RouterClass<TRoutes extends Route[]> {
  private _routes: TRoutes = [] as TRoutes;
  private _currentRoute: ResolvedRoute;

  // Subscribe to route changes
  private _subscriptions = new Set<
    (prevRoute: ResolvedRoute | undefined, currentRoute: ResolvedRoute) => void
  >();

  constructor(options: RouterOptions<TRoutes>) {
    this._routes = options.routes;
  }

  get routes(): TRoutes {
    return this._routes;
  }

  get currentRoute(): ResolvedRoute {
    return this._currentRoute;
  }

  init(): void {
    this._renderRoute(this._currentUrl);

    window.addEventListener('popstate', this._onPopState.bind(this));
  }

  cleanup(): void {
    window.removeEventListener('popstate', this._onPopState.bind(this));
  }

  push<TPathname extends ExtractPaths<TRoutes>>(path: PathObject<TPathname>): void;
  push(path: string): void;
  push(path: any): void {
    if (typeof path === 'object') {
      path = this._compilePathObject(path);
    }
    window.history.pushState({}, '', path);
    this._renderRoute(new URL(path, 'http://localhost')); // dummy origin for URL constructor
  }

  replace<TPathname extends ExtractPaths<TRoutes>>(path: PathObject<TPathname>): void;
  replace(path: string): void;
  replace(path: any): void {
    if (typeof path === 'object') {
      path = this._compilePathObject(path);
    }
    window.history.replaceState({}, '', path);
    this._renderRoute(new URL(path, 'http://localhost')); // dummy origin for URL constructor
  }

  subscribe(
    callback: (prevRoute: ResolvedRoute | undefined, currentRoute: ResolvedRoute) => void
  ): () => void {
    this._subscriptions.add(callback);
    return () => {
      this._subscriptions.delete(callback);
    };
  }

  private get _currentUrl(): URL {
    return new URL(window.location.href);
  }

  private _onPopState(): void {
    this._renderRoute(this._currentUrl);
  }

  private _compilePathObject(path: PathObject<string>): string {
    const pathname = compile(path.pathname)(path.params);
    const searchParams = queryString.stringify(path.search);

    const fullPath = pathname + (searchParams ? `?${searchParams}` : '');
    return fullPath;
  }

  private _renderRoute(url: URL): void {
    const fullPath = url.href.replace(url.origin, '');
    if (fullPath === this._currentRoute?.fullPath) {
      console.warn(`Navigation to the same path "${fullPath}" is not allowed`);
      return;
    }
    const currentRoute = this._resolveRoute(url.pathname);

    if (!currentRoute) {
      throw new Error(`Route not found: ${url.pathname}`);
    }
    currentRoute.path = url.pathname;
    currentRoute.fullPath = fullPath;
    currentRoute.search = queryString.parse(url.search);

    const prevRoute = this._currentRoute;

    this._currentRoute = currentRoute;
    this._subscriptions.forEach((callback) => callback(prevRoute, this._currentRoute));
  }

  private _resolveRoute(path: string): ResolvedRoute | null {
    const result = matchRoutes(this.routes, path);
    return result;
  }
}

// Global router instance
let activeRouter: RouterClass<Route[]>;

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
export type AnyRouter = RouterClass<Route[]>;

export type RegisteredRouter = Register extends {
  router: infer TRouter extends AnyRouter;
}
  ? TRouter
  : AnyRouter;
