import { type Route, Router } from '@smoljs/router';
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
] satisfies Route[];

const router = Router.create({ routes }).init();

declare module '@smoljs/router' {
  interface Register {
    router: typeof router
  }
}

createApp(App).mount(document.querySelector('#app'));
