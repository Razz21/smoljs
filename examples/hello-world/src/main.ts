import { Counter } from './components';
import './style.css';
import { createApp, defineComponent, h } from 'smoljs';

const App = defineComponent({
  render() {
    return h(Counter);
  },
});

createApp(App).mount(document.querySelector('#app'));
