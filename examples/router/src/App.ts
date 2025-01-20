import { Router, RouterLink, RouterRoot } from '@smoljs/router';
import { defineComponent, h, hFragment } from 'smoljs';

export const Navigation = defineComponent({
  state() {
    return {
      currentRoute: Router.currentRoute.path,
    };
  },
  onMounted() {
    Router.subscribe((_, nextRoute) => {
      this.updateState({ currentRoute: nextRoute.path });
    });
  },
  render() {
    const { currentRoute } = this.state;
    const isActive = (path: string) => (currentRoute === path ? 'active' : '');

    return h('nav', {}, [
      h(RouterLink, { to: '/', class: isActive('/') }, ['Home']),
      h(RouterLink, { to: '/about', class: isActive('/about') }, ['About']),
      // @ts-expect-error - Not registered route
      h(RouterLink, { to: '/invalid', class: isActive('/invalid') }, ['Invalid']),
    ]);
  },
});

export const App = defineComponent({
  render() {
    return hFragment([h(Navigation), h(RouterRoot)]);
  },
});
