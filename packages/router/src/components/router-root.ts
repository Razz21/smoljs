import { defineComponent, h } from '@smoljs/runtime';
import { Router } from '../router';

export const RouterRoot = defineComponent({
  state() {
    return {
      currentRoute: Router.currentRoute.path,
    };
  },
  render() {
    Router.onRouteChange((_, nextRoute) => {
      this.updateState({ currentRoute: nextRoute.path });
    });
    const component = Router.currentRoute.component;
    return h(component);
  },
});
