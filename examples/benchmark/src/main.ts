import './style.css';
import { createApp, defineComponent, h, hFragment } from 'smoljs';
import { Grid } from './components';

const App = defineComponent({
  render() {
    return hFragment([
      h('main', null, [
        h('h1', null, ['Benchmark Smoljs']),
        h('p', null, [
          'This benchmark is designed to test the performance of ',
          h('a', { href: 'http://github.com/Razz21/smoljs', target: '_blank' }, ['Smoljs']),
          ' by rendering a number of elements. ',
        ]),
        h(Grid),
      ]),
      h('footer', null, ['created by @Razz21']),
    ]);
  },
});

createApp(App).mount(document.querySelector('#app'));
