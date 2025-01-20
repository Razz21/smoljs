import { type Route, RouterClass, RouterOptions, createRouter } from '@smoljs/router';
import { createApp, defineComponent, h } from 'smoljs';
import { App } from './App';
import './style.css';

const Home = defineComponent({
  render: () => h('div', { class: 'page' }, [h('h1', null, ['Home Page'])]),
});

function About() {
  return h('div', { class: 'page' }, [h('h1', null, ['About Page'])]);
}

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/about',
    component: About,
  },
] as const satisfies Route[];

const router = createRouter({ routes });
router.init();

declare module '@smoljs/router' {
  interface Register {
    router: typeof router;
  }
}

createApp(App).mount(document.querySelector('#app'));
