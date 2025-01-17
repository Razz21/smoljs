import { defineComponent, h } from 'smoljs';

export const Counter = defineComponent({
  state() {
    return {
      count: 0,
    };
  },
  methods: {
    increment() {
      this.updateState((prevState) => ({ count: prevState.count + 1 }));
    },
    decrement() {
      this.updateState((prevState) => ({ count: prevState.count - 1 }));
    },
  },
  render() {
    const increment = this.increment;
    const decrement = this.decrement;

    return h('div', null, [
      h('h1', null, ['Counter App']),
      h('div', { class: 'counter' }, [this.state.count.toString()]),
      h('button', { on: { click: decrement } }, ['-']),
      h('button', { on: { click: increment } }, ['+']),
    ]);
  },
});
