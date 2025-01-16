import './style.css';
import { createApp, defineComponent, h, hFragment } from 'simple-vue';
import { Grid } from './components';

const _disclaimer = `⚠️ Warning: Use This Benchmark at Your Own Risk! ⚠️

By proceeding, you acknowledge that:

• This benchmark may push your system harder than your Monday deadlines.
• If your computer starts sounding like a jet engine or achieves sentience, that’s on you.
• We are not liable for melted GPUs, fried CPUs, or the sudden disappearance of your RGB lighting.
• Any crashes, data loss, or existential crises triggered by this benchmark are entirely your responsibility.
`;

const App = defineComponent({
  render() {
    return hFragment([
      h('main', null, [
        h('h1', null, ['Benchmark Simple-Vue']),
        h('p', null, [
          'This benchmark is designed to test the performance of ',
          h('a', { href: 'http://github.com/Razz21/simple-vue', target: '_blank' }, ['Simple-Vue']),
          ' by rendering a number of elements. ',
        ]),
        h(Grid),
      ]),
      h('footer', null, ['created by @Razz21']),
    ]);
  },
  onMounted() {
    // alert(disclaimer);
  },
});

createApp(App).mount(document.querySelector('#app'));
