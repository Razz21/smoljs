import { RouterLink, RouterRoot, useRouter } from '@smoljs/router';
import { defineComponent, h, hFragment } from 'smoljs';

export const Navigation = defineComponent({
  state() {
    const router = useRouter();
    return {
      currentRoute: router.currentRoute?.path || '',
    };
  },
  onMounted() {
    const router = useRouter();
    router.subscribe((_, nextRoute) => {
      this.updateState({ currentRoute: nextRoute.path });
    });
  },
  render() {
    const { currentRoute } = this.state;
    const isActive = (path: string) => (currentRoute === path ? 'active' : '');

    return h('nav', {}, [
      h(RouterLink, { to: '/', class: isActive('/') }, ['Home']),
      h(RouterLink, { to: '/about', class: isActive('/about') }, ['About']),
      h(RouterLink, { to: '/profile', class: isActive('/profile') }, ['Profile']),
      h(RouterLink, { to: '/profile/settings', class: isActive('/profile/settings') }, ['Profile Settings']),
      h(RouterLink, { to: '/profile/account', class: isActive('/profile/account') }, ['Profile account']),
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
