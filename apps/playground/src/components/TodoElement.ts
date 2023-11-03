import { h } from '@simple-vue/runtime';

function DeleteButton(props: { onClick: () => void }) {
  return h('button', { on: { click: props.onClick }, class: ['delete-btn'] }, ['✕']);
}

export function TodoElement(props: { content: string; onClick: () => void }) {
  return h('li', { class: 'todo' }, [props.content, DeleteButton({ onClick: props.onClick })]);
}
