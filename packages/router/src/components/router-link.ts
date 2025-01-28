import type { GeneratePathsFromRoutes } from '@/types';
import { type ElementProps, type VNodeProps, defineComponent, h } from '@smoljs/runtime';
import { type RegisteredRouter, useRouter } from '../router';

type RouterPath = GeneratePathsFromRoutes<RegisteredRouter['routes']>;

export const RouterLink = defineComponent({
  render(props: { to: RouterPath } & VNodeProps<ElementProps<'a'>>, { children }) {
    const { to, ...attrs } = props;
    const router = useRouter();
    return h(
      'a',
      {
        ...attrs,
        href: to,
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
