import type { ComponentInstance } from '@smoljs/runtime';

export type RoutePath = `/${string}`;

export type Route = {
  path: RoutePath;
  component: ComponentInstance<any, any>;
};

export type RouterOptions = {
  routes: Route[];
};

export type CurrentRoute = Route;

export class Router {
  static _routes: Route[];
  static _currentRoute: CurrentRoute;
  static _onRouteChange: (prevRoute: Route | undefined, currentRoute: Route) => void;

  static create(options: RouterOptions) {
    Router._routes = options.routes;
    return Router;
  }

  static _renderRoute(path: string) {
    const route = Router._routes.find((route) => route.path === path);
    if (!route?.component) {
      // Handle 404 - Page Not Found
      throw new Error('404: Page not found');
    }
    if (route.path === Router._currentRoute?.path) {
      console.warn('Navigation to the same path is not allowed');
      return;
    }

    const prev = Router._currentRoute;
    Router._currentRoute = route;
    Router._onRouteChange?.(prev, Router._currentRoute);
  }

  static push(path: string) {
    window.history.pushState({}, '', path);
    Router._renderRoute(path);
  }

  static replace(path: string) {
    window.history.replaceState({}, '', path);
    Router._renderRoute(path);
  }

  static init() {
    // Initial route rendering
    Router._renderRoute(window.location.pathname);
  }

  static onRouteChange(cb: (prevRoute: Route | undefined, currentRoute: Route) => void) {
    Router._onRouteChange = cb;
  }

  static get routes() {
    return Router._routes;
  }

  static get currentRoute() {
    return Router._currentRoute;
  }
}

export function useRouter() {
  return {
    push: Router.push,
    replace: Router.replace,
    currentRoute: Router.currentRoute,
  };
}
