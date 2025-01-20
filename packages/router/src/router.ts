import type { ComponentInstance, FunctionComponent } from '@smoljs/runtime';

export type RoutePath = string;

export type Route<T extends RoutePath = RoutePath> = {
  path: T;
  component: ComponentInstance | FunctionComponent<any>;
};
export type RouterOptions<TPath extends RoutePath> = { routes: Route<TPath>[] };

class RouterClass<TPath extends RoutePath = RoutePath> {
  private static instance: RouterClass<any>;
  private _routes: Route<TPath>[] = [];
  private _currentRoute: Route<TPath>;
  private _historyListener: () => void;
  private _subscriptions: Set<
    (prevRoute: Route<TPath> | undefined, currentRoute: Route<TPath>) => void
  > = new Set();

  private constructor() {}

  public static getInstance<TPath extends RoutePath>(): RouterClass<TPath> {
    if (!RouterClass.instance) {
      RouterClass.instance = new RouterClass<TPath>();
    }
    return RouterClass.instance as RouterClass<TPath>;
  }

  get routes(): Route<TPath>[] {
    return this._routes;
  }

  create<T extends TPath>(options: RouterOptions<T>): RouterClass<T> {
    this._routes = options.routes;
    return this as any;
  }

  /**
   * Renders the route based on the given path.
   * Finds the route matching the path and updates the current route.
   * Notifies subscribers about the route change.
   * @param path - The path to render.
   * @throws Will throw an error if the route is not found.
   */
  private _renderRoute(path: string) {
    const route = this._routes.find((route) => route.path === path);
    if (!route?.component) {
      throw new Error('404: Page not found');
    }
    if (route.path === this._currentRoute?.path) {
      console.warn('Navigation to the same path is not allowed');
      return;
    }

    const prevRoute = this._currentRoute;
    this._currentRoute = route;

    this._subscriptions.forEach((callback) => callback(prevRoute, this._currentRoute));
  }

  push(path: string) {
    window.history.pushState({}, '', path);
    this._renderRoute(path);
  }

  replace(path: string) {
    window.history.replaceState({}, '', path);
    this._renderRoute(path);
  }

  /**
   * Initializes the router by rendering the current path and setting up the history listener.
   * @returns The instance of the router.
   */
  init(): RouterClass<TPath> {
    this._renderRoute(window.location.pathname);

    // Subscribe to popstate event for history changes (back/forward buttons)
    this._historyListener = () => {
      this._renderRoute(window.location.pathname);
    };
    window.addEventListener('popstate', this._historyListener);
    return this;
  }

  subscribe(callback: (prevRoute: Route<TPath> | undefined, currentRoute: Route<TPath>) => void) {
    this._subscriptions.add(callback);

    return () => {
      this._subscriptions.delete(callback);
    };
  }

  cleanup() {
    window.removeEventListener('popstate', this._historyListener);
  }

  get currentRoute() {
    return this._currentRoute;
  }
}

export const Router = RouterClass.getInstance();

export interface Register {
  // router
}

export type RegisteredRouter = Register extends {
  router: infer TRouter extends RouterClass;
}
  ? TRouter
  : RouterClass;
