import { h } from 'smoljs';
import { TodoElement } from './TodoElement';

export function TodoList(props: { todos: string[]; onDelete: (index: number) => void }) {
  const todos = props.todos.map((todo, index) => {
    return TodoElement({ content: todo, onClick: () => props.onDelete(index) });
  });
  return h('ul', { class: 'todos' }, todos);
}
