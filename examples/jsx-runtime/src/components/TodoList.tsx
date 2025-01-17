import type { Todo } from '../types';
import { TodoElement } from './TodoElement';

export function TodoList(props: {
  todos: Todo[];
  onDelete: (id: Todo['id']) => void;
  onChange: (id: Todo['id'], value: Partial<Pick<Todo, 'value' | 'completed'>>) => void;
}) {
  return (
    <ul className="todo-items">
      {props.todos.map((todo) => (
        <TodoElement
          completed={todo.completed}
          key={todo.id}
          onChange={(value) => props.onChange(todo.id, value)}
          onDelete={() => {
            props.onDelete(todo.id);
          }}
        >
          {todo.value}
        </TodoElement>
      ))}
    </ul>
  );
}
