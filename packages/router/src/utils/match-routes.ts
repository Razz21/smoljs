import type { ResolvedRoute, Route } from '@/types';
import { match } from 'path-to-regexp';

export function matchRoutes(routes: Route[], path: string): ResolvedRoute | null {
  for (const route of routes) {
    const result = findMatchingRoutes(route, path);
    if (result) {
      return result;
    }
  }
  return null;
}

function findMatchingRoutes(root: Route, path: string): ResolvedRoute | null {
  let result: ResolvedRoute = null;

  function traverse(route: Route, currentBranch: Route[], fullPath: string): void {
    const newFullPath = `${fullPath}/${route.path}`.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
    const newBranch = [...currentBranch, route];

    const matchFn = match(newFullPath, { decode: decodeURIComponent });
    const matchResult = matchFn(path);

    if (matchResult) {
      result = {
        matchedRoutes: newBranch,
        pathname: newFullPath,
        params: matchResult.params,
        path: matchResult.path,
        search: null,
        fullPath: null,
      };
      return;
    }

    if (route.children) {
      for (const child of route.children) {
        traverse(child, newBranch, newFullPath);
      }
    }
  }

  traverse(root, [], '');
  return result;
}
