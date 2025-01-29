import type { GeneratePathsFromRoutes, ResolvedRoute, Route, RouterOptions } from './types';
import { matchRoutes } from './utils';

// Core Router Class
export class RouterClass<TRoutes extends Route[], TPath extends GeneratePathsFromRoutes<TRoutes>> {
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
    this._renderRoute(window.location.pathname);

    window.addEventListener('popstate', this._onPopState.bind(this));
  }

  cleanup() {
    window.removeEventListener('popstate', this._onPopState.bind(this));
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
    callback: (prevRoute: ResolvedRoute | undefined, currentRoute: ResolvedRoute) => void
  ): () => void {
    this._subscriptions.add(callback);
    return () => {
      this._subscriptions.delete(callback);
    };
  }

  _onPopState() {
    this._renderRoute(window.location.pathname);
  }

  private _renderRoute(path: string): void {
    if (path === this._currentRoute?.path) {
      console.warn(`Navigation to the same path "${path}" is not allowed`);
      return;
    }
    const currentRoute = this._resolveRoute(path);

    if (!currentRoute) {
      throw new Error(`Route not found: ${path}`);
    }

    const prevRoute = this._currentRoute;

    this._currentRoute = currentRoute;
    this._subscriptions.forEach((callback) => callback(prevRoute, this._currentRoute));
  }

  private _resolveRoute(path: string) {
    const result = matchRoutes(this.routes, path);
    return result;
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
