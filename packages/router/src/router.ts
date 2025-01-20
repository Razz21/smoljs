import type { ComponentInstance, FunctionComponent } from '@smoljs/runtime';

export type RoutePath = string;

export type Route<T extends RoutePath = RoutePath> = {
  path: T;
  component: ComponentInstance | FunctionComponent<any>;
};

export type RouterOptions<TPath extends RoutePath> = { routes: Route<TPath>[] };

// Core Router class
export class RouterClass<TPath extends RoutePath> {
  private _routes: Route<TPath>[] = [];
  private _currentRoute?: Route<TPath>;
  private _subscriptions = new Set<
    (prevRoute: Route<TPath> | undefined, currentRoute: Route<TPath>) => void
  >();

  constructor(options: RouterOptions<TPath>) {
    this._routes = options.routes;
  }

  get routes(): Route<TPath>[] {
    return this._routes;
  }

  get currentRoute(): Route<TPath> | undefined {
    return this._currentRoute;
  }

  init(): void {
    this._renderRoute(window.location.pathname);

    window.addEventListener('popstate', () => {
      this._renderRoute(window.location.pathname);
    });
  }

  push(path: TPath): void {
    window.history.pushState({}, '', path);
    this._renderRoute(path);
  }

  replace(path: TPath): void {
    window.history.replaceState({}, '', path);
    this._renderRoute(path);
  }

  subscribe(
    callback: (prevRoute: Route<TPath> | undefined, currentRoute: Route<TPath>) => void
  ): () => void {
    this._subscriptions.add(callback);
    return () => {
      this._subscriptions.delete(callback);
    };
  }

  private _renderRoute(path: string): void {
    const route = this._routes.find((route) => route.path === path);
    if (!route) {
      throw new Error(`Route not found: ${path}`);
    }
    const prevRoute = this._currentRoute;
    this._currentRoute = route;
    this._subscriptions.forEach((callback) => callback(prevRoute, route));
  }
}

// Global router instance
let activeRouter: RouterClass<any>;

export function useRouter<TPath extends RoutePath>(): RouterClass<TPath> {
  if (!activeRouter) {
    throw new Error('Router is not initialized. Please create a router instance first.');
  }
  return activeRouter as RouterClass<TPath>;
}

// Factory function to create the router
export function createRouter<TPath extends RoutePath>(
  options: RouterOptions<TPath>
): RouterClass<TPath> {
  const router = new RouterClass<TPath>(options);
  activeRouter = router;
  return router;
}

// Type for manual declaration merging
export interface Register {
  // router 
}
export type AnyRouter = RouterClass<RoutePath>;

export type RegisteredRouter = Register extends {
  router: infer TRouter extends AnyRouter;
}
  ? TRouter
  : AnyRouter;
