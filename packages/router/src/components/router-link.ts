import { type ElementProps, type VNodeProps, defineComponent, h } from '@smoljs/runtime';
import { Router } from '../router';

export const RouterLink = defineComponent({
  render(props: { to: string } & VNodeProps<ElementProps<'a'>>, { children }) {
    const { to, ...attrs } = props;
    return h(
      'a',
      {
        ...attrs,
        href: to,
        on: {
          click: (e) => {
            e.preventDefault();
            Router.push(to);
          },
        },
      },
      children
    );
  },
});
