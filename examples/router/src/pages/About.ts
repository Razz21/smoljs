import { defineComponent, h } from 'smoljs';

export default defineComponent({
  render() {
    return h('div', { class: 'page' }, [h('h1', null, ['About Page'])]);
  },
});
