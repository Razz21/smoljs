import { type Route, Router } from '@smoljs/router';
import { createApp } from 'smoljs';
import { App } from './App';
import './style.css';
import AboutPage from './pages/About';
import Home from './pages/Home';

const routes: Route[] = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/about',
    component: AboutPage,
  },
];

Router.create({ routes }).init();

createApp(App).mount(document.querySelector('#app'));
