import type { GeneratePathsFromRoutes } from '@/types';
import { type ElementProps, type VNodeProps, defineComponent, h } from '@smoljs/runtime';
import { type RegisteredRouter, useRouter } from '../router';

type RouterPath = GeneratePathsFromRoutes<RegisteredRouter['routes']> | (string & {});

export const RouterLink = defineComponent({
  render(props: { to: RouterPath; exact?: boolean } & VNodeProps<ElementProps<'a'>>, { children }) {
    const { to, exact, ...attrs } = props;
    const router = useRouter();
    const klass = [isActive(router.currentRoute.path, to, exact), attrs.class || ''].join(' ');
    return h(
      'a',
      {
        ...attrs,
        href: to,
        class: klass,
        on: {
          click: (e) => {
            e.preventDefault();
            attrs.on?.click?.(e);
            router.push(to);
          },
        },
      },
      children
    );
  },
});

const isActive = (currentRoute: string, path: string, exact?: boolean) =>
  (exact ? currentRoute === path : currentRoute.startsWith(path)) ? 'active' : '';
