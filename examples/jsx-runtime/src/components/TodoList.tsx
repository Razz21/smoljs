import { Todo } from '../types';
import { TodoElement } from './TodoElement';

export function TodoList(props: {
  todos: Todo[];
  onDelete: (id: Todo['id']) => void;
  onChange: (id: Todo['id'], value: string) => void;
}) {
  return (
    <ul className="todos">
      {props.todos.map((todo) => (
        <TodoElement
          key={todo.id}
          onChange={(value) => props.onChange(todo.id, value)}
          onClick={() => {
            props.onDelete(todo.id);
          }}
        >
          {todo.value}
        </TodoElement>
      ))}
    </ul>
  );
}
