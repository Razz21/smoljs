import './style.css';
import { defineComponent, h, hFragment } from '@simple-vue/runtime';

type FlyingButtonProps = {
  width: number;
  height: number;
};

const BaseButton = defineComponent({
  state() {
    return {
      count: 1,
    };
  },
  render(props: { text: string }) {
    return h('button', null, [props.text]);
  },
  onMounted() {
    console.log('mounted');
  },
});

const FlyingButton = defineComponent({
  state({ width, height }: FlyingButtonProps) {
    return {
      x: Math.round(Math.random() * width),
      y: Math.round(Math.random() * height),
    };
  },
  methods: {
    numberToPx(num: number): string {
      return num + 'px';
    },
  },
  render() {
    const { height, width } = this.props;
    const { x, y } = this.state;

    const button = h(
      'button',
      {
        style: {
          position: 'absolute',
          left: this.numberToPx(x),
          top: this.numberToPx(y),
        },
        on: {
          click: () => {
            this.updateState({
              x: Math.round(Math.random() * width),
              y: Math.round(Math.random() * height),
            });
          },
        },
      },
      [`Move ${x} ${y}`]
    );
    const basebutton2 = h(BaseButton, { text: 'button text content' });

    return hFragment([button, basebutton2]);
  },
});

const element = new FlyingButton({ width: 200, height: 150 });
element.mount(document.querySelector('#app')!);
