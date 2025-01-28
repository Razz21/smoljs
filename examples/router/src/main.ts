import { type Route, createRouter } from '@smoljs/router';
import { createApp, defineComponent, h } from 'smoljs';
import { App } from './App';
import './style.css';

const Home = defineComponent({
  render: () => h('div', { class: 'page' }, [h('h1', null, ['Home Page'])]),
});

function About() {
  return h('div', { class: 'page' }, [h('h1', null, ['About Page'])]);
}

const ProfilePage = defineComponent({
  render(_, { children }) {
    return h('div', { class: 'page profile' }, [
      h('h1', null, ['Profile Page']), //
      ...children,
    ]);
  },
});

const ProfileSettings = defineComponent({
  render() {
    return h('div', { class: 'page sub-page' }, ['Profile Settings']);
  },
});

const ProfileAccount = defineComponent({
  render() {
    return h('div', { class: 'page sub-page' }, ['Profile Account']);
  },
});

const routes = [
  {
    path: '/profile',
    component: ProfilePage,
    children: [
      {
        path: '/settings',
        component: ProfileSettings,
      },
      {
        path: '/account',
        component: ProfileAccount,
      },
    ],
  },
  {
    path: '/about',
    component: About,
  },
  {
    path: '/',
    component: Home,
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
