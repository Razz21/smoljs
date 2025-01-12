import './style.css';
import { createApp } from 'simple-vue';
import { App } from './App';

createApp(App, { title: 'Hello world from the Simple Vue app' }).mount(
  document.querySelector('#app')
);
