import { defineComponent, h, hFragment } from 'smoljs';

const GridItemClass = defineComponent({
  render(props: any) {
    return h('div', {
      ...props,
      class: 'grid-item',
    });
  },
});

const GridItemFC = (props: any) => {
  return h('div', {
    ...props,
    class: 'grid-item',
  });
};

function arrItems(items: number) {
  return new Array(items).fill(null).map((_) => Math.random().toPrecision(2));
}
const selectItems = [
  { value: 10, label: "C'mon" },
  { value: 100, label: 'Brrr' },
  { value: 500, label: 'Face hurts level' },
  { value: 1000, label: "You're freezing my hiney off" },
  { value: 2000, label: 'Blitzkrieg' },
  { value: 5000, label: 'Cryogenic territory' },
  { value: 10000, label: 'Absolute zero' },
];
export const Grid = defineComponent({
  state() {
    return {
      elements: [] as string[],
      rAF: undefined as number | undefined,
      itemsToRender: 10,
      isFnComponent: false,
    };
  },
  methods: {
    onChange(e?: Event) {
      if (!e?.currentTarget) return;
      const value = +(e.currentTarget as HTMLInputElement).value;
      this.updateState({
        itemsToRender: value,
      });
    },
    toggleComponentType() {
      this.updateState((prev) => ({
        ...prev,
        isFnComponent: !prev.isFnComponent,
      }));
    },
  },
  render() {
    const state = this.state;
    const onChange = this.onChange;
    const toggleComponentType = this.toggleComponentType;
    const ComponentToRender = state.isFnComponent ? GridItemFC : GridItemClass;

    return hFragment([
      h('fieldset', { class: 'element-to-move' }, [
        h('legend', null, ["Let's ", h('i', null, ['freeze']), ' a browser']),
        h('label', {}, [
          h('input', {
            type: 'checkbox',
            name: 'component-type',
            value: 'function-component',
            on: { click: toggleComponentType },
            checked: state.isFnComponent === true || undefined,
          }),
          'Render Function Component',
        ]),
        ...selectItems.map((item) => {
          return h('label', { key: item.value }, [
            h('input', {
              type: 'radio',
              name: 'grid-item',
              value: String(item.value),
              on: { click: onChange },
              checked: state.itemsToRender === item.value || undefined,
            }),
            `${item.label} (${item.value})`,
          ]);
        }),
      ]),
      h(
        'div',
        { class: 'grid', style: {} },
        state.elements.map((el, index) => {
          return h(ComponentToRender, { key: index, style: { opacity: el } });
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
