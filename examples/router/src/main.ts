import { type Route, RouterLink, createRouter, useRouter } from '@smoljs/router';
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
  render(_, { children }) {
    return h('div', { class: 'page sub-page' }, [
      'Profile Settings',
      h('nav', {}, [
        h(RouterLink, { to: '/profile/settings/100' }, ['Profile 100']),
        h(RouterLink, { to: '/profile/settings/123' }, ['Profile 123']),
      ]),
      ...children,
    ]);
  },
});

const ProfileSettingsId = defineComponent({
  render() {
    const router = useRouter();
    const id = router.currentRoute.params.id;
    return h('div', { class: 'page sub-page' }, [`Profile Settings ID: ${id}`]);
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
        children: [
          {
            path: '/:id',
            component: ProfileSettingsId,
          },
        ],
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
