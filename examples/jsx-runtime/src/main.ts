import './style.css';
import { createApp } from 'smoljs';
import { App } from './App';

createApp(App, { title: 'Hello world from the Smoljs app' }).mount(
  document.querySelector('#app')
);
