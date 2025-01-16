import { h } from 'smoljs';
import { getFormData } from '../utils';

type CreateTodoProps = {
  onSubmit: (payload: { todo: string }) => void;
};

function CreateTodoTitle() {
  return h('h2', null, ['Create Todos']);
}

function CreateTodoForm({ onSubmit }: CreateTodoProps) {
  function onSubmitHandler(event?: SubmitEvent) {
    event?.preventDefault();
    const formData = getFormData<{ todo: string }>(event?.target as HTMLFormElement);
    if (!formData.todo) return;

    onSubmit(formData);
    (event?.target as HTMLFormElement).reset();
  }
  return h(
    'form',
    {
      on: {
        submit: onSubmitHandler,
      },
      autocomplete: 'off',
    },
    [h('input', { name: 'todo', type: 'text', placeholder: 'Add todo' }), h('button', { type: 'submit' }, ['Submit'])]
  );
}

export function CreateTodo({ onSubmit }: CreateTodoProps) {
  return h('div', {}, [CreateTodoTitle(), CreateTodoForm({ onSubmit })]);
}
