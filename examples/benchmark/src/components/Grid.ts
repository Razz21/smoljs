import { defineComponent, h, hFragment } from 'smoljs';

const _GridItem = defineComponent({
  render({ ...rest }: {}) {
    return h('div', {
      ...rest,
      class: 'grid-item',
      style: { opacity: Math.random().toPrecision(2) },
    });
  },
});

const GridItemFC = ({ ...rest }: {}) => {
  return h('div', {
    ...rest,
    class: 'grid-item',
    style: { opacity: Math.random().toPrecision(2) },
  });
};

function arrItems(items: number) {
  return new Array(items)
    .fill(null)
    .map((_, i) => i)
    .sort(() => Math.random() - 0.5);
}

export const Grid = defineComponent({
  state() {
    return {
      elements: [] as number[],
      rAF: undefined as number | undefined,
      itemsToRender: 10,
      selectItems: [
        { value: 10, label: "C'mon" },
        { value: 100, label: 'Brrr' },
        { value: 500, label: 'Face hurts level' },
        { value: 1000, label: "You're freezing my hiney off" },
        { value: 2000, label: 'Blitzkrieg' },
        { value: 5000, label: 'Cryogenic territory' },
        { value: 10000, label: 'Absolute zero' },
      ],
    };
  },
  render() {
    const onChange = (e?: Event) => {
      if (!e?.currentTarget) return;
      const value = +(e.currentTarget as HTMLInputElement).value;
      this.updateState({
        itemsToRender: value,
      });
    };
    const state = this.state;

    return hFragment([
      h('fieldset', { class: 'element-to-move' }, [
        h('legend', null, ["Let's ", h('i', null, ['freeze']), ' a browser']),
        ...state.selectItems.map((item) => {
          return h('label', { key: item.value }, [
            h('input', {
              type: 'radio',
              name: 'grid-item',
              value: String(item.value),
              on: { click: onChange },
              checked: state.itemsToRender === item.value || undefined,
            }),
            [`${item.label} (${item.value})`],
          ]);
        }),
      ]),
      h(
        'div',
        { class: 'grid', style: {} },
        state.elements.map((_, index) => {
          return h(GridItemFC, { key: index });
        })
      ),
    ]);
  },

  onMounted() {
    let rAF: number | undefined;

    const loopRaF = () => {
      rAF = undefined;
      const elements = arrItems(this.state.itemsToRender);

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
