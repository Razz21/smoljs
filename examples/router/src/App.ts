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
    return h('nav', {}, [
      h(RouterLink, { to: '/', exact: true }, ['Home']),
      h(RouterLink, { to: '/about' }, ['About']),
      h(RouterLink, { to: '/profile', exact: true }, ['Profile']),
      h(RouterLink, { to: '/profile/settings' }, ['Profile Settings']),
      h(RouterLink, { to: '/profile/account' }, ['Profile account']),
      // Not registered route
      h(RouterLink, { to: '/invalid' }, ['Invalid']),
    ]);
  },
});

export const App = defineComponent({
  render() {
    return hFragment([h(Navigation), h(RouterRoot)]);
  },
});
