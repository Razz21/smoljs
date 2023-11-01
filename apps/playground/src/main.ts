import './style.css';
import { defineComponent, h } from '@simple-vue/runtime';

type FlyingButtonProps = {
  width: number;
  height: number;
};

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
  render({ height, width }) {
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
    return button;
  },
});

const element = new FlyingButton({ width: 100, height: 50 });
element.mount(document.querySelector('#app')!);
