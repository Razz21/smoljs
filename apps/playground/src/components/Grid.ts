// @ts-nocheck
import { defineComponent, h } from 'simple-vue';

const GridItem = defineComponent({
  render({ ...rest }: {}) {
    return h('div', { ...rest, class: 'grid-item', style: { opacity: Math.random().toPrecision(2) } });
  },
});

const GridItemFC = ({ ...rest }: {}) => {
  return h('div', { ...rest, class: 'grid-item', style: { opacity: Math.random().toPrecision(2) } });
};

const toRender = 6;

export const Grid = defineComponent({
  state(props: { numberToRender?: number }) {
    return {
      elements: new Array(props.numberToRender).fill(null),
      // .map((_, i) => i)
      // .sort(() => Math.random() - 0.5),
      rAF: undefined as number | undefined,
    };
  },
  render(props: { numberToRender?: number }) {
    return h(
      'div',
      { class: 'grid', style: {} } as any,
      this.state.elements.map((_, index) => {
        return h(GridItem, { key: index });
        // return GridItemFC({ key: index });
      })
    );
  },
  onMounted() {
    const elementsToRender = this.props.numberToRender ?? toRender;
    let rAF: number | undefined;

    const loopRaF = () => {
      rAF = undefined;
      const elements = new Array(elementsToRender).fill(null);
      // .map((_, i) => i)
      // .sort(() => Math.random() - 0.5);
      this.updateState({ elements, rAF });
      startAnim();
    };
    const startAnim = () => {
      if (!this.state.rAF) {
        rAF = requestAnimationFrame(loopRaF);
      }
    };
    startAnim();
  },
  onUnmounted() {
    if (this.state.rAF) {
      cancelAnimationFrame(this.state.rAF);
      this.updateState({ rAF: undefined });
    }
  },
});
