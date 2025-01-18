import { RouterLink, RouterRoot, useRouter } from '@smoljs/router';
import { defineComponent, h, hFragment } from 'smoljs';

function Navigation() {
  const router = useRouter();
  return h('nav', {}, [
    h('h1', {}, [router.currentRoute.path]), //
    h(RouterLink, { to: '/' }, ['Home']), //
    h(RouterLink, { to: '/about' }, ['About']), //
    h('hr', { class: 'divider' }),
  ]);
}

export const App = defineComponent({
  render() {
    return hFragment([h(Navigation), h(RouterRoot)]);
  },
});
