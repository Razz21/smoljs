import { defineComponent, h } from '@smoljs/runtime';
import { useRouter } from '../router';

export const RouterRoot = defineComponent({
  state() {
    const router = useRouter();
    return {
      currentRoute: router.currentRoute?.path || '',
    };
  },
  render() {
    const router = useRouter();
    router.subscribe((_, nextRoute) => {
      this.updateState({ currentRoute: nextRoute.path });
    });

    const component = router.currentRoute?.component;
    if (!component) {
      throw new Error('No component found for the current route');
    }

    return h(component);
  },
});
