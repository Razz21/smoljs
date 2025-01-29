import type { Route } from '@/types';
import { defineComponent, h } from '@smoljs/runtime';
import { useRouter } from '../router';

export const RouterRoot = defineComponent({
  state() {
    const router = useRouter();
    return {
      currentRoute: router.currentRoute,
      cleanup: () => {},
    };
  },
  onMounted() {
    const router = useRouter();
    const cleanup = router.subscribe((_, nextRoute) => {
      this.updateState({ currentRoute: nextRoute });
    });
    this.updateState((prev) => ({ ...prev, cleanup }));
  },
  onUnmounted() {
    this.state.cleanup();
  },
  render() {
    const matchedRoutes = this.state.currentRoute.matchedRoutes;

    if (matchedRoutes.length === 0) {
      throw new Error('No matched routes found');
    }

    return renderComponents(matchedRoutes);
  },
});

function renderComponents(routes: Route[], index = 0) {
  const route = routes.at(index);

  if (!route) {
    return null;
  }
  const Component = route.component;

  if (!Component) {
    throw new Error(`Component not found for route: ${route.path}`);
  }

  const childComponent = renderComponents(routes, index + 1);
  // force key to re-render the component and its children
  return h(Component, { key: route.path }, childComponent ? [childComponent] : []);
}
