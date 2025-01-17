import type { Todo } from '../types';

function DeleteButton(props: { onClick: () => void }) {
  return (
    <button className="todo-delete-btn" onClick={props.onClick}>
      &#x2715;
    </button>
  );
}

export function TodoElement(props: {
  children: JSX.Element;
  onDelete: () => void;
  onChange: (value: Partial<Pick<Todo, 'value' | 'completed'>>) => void;
  completed?: boolean;
}) {
  return (
    <li class={`todo-item ${props.completed ? 'completed' : ''}`}>
      <label class="todo-checkbox">
        <input
          hidden
          type="checkbox"
          checked={props.completed || undefined}
          onChange={(event) =>
            props.onChange({ completed: (event.target as HTMLInputElement).checked })
          }
        />
        <span tabIndex={0} class="checkmark"></span>
      </label>
      <span className="todo-text">{props.children}</span>
      <DeleteButton onClick={props.onDelete} />
    </li>
  );
}
