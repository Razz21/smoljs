import { getFormData } from '../utils';

type CreateTodoProps = {
  onSubmit: (payload: { todo: string }) => void;
};

function CreateTodoTitle() {
  return <h2>Create Todos</h2>;
}

function CreateTodoForm({ onSubmit }: CreateTodoProps) {
  function onSubmitHandler(event?: SubmitEvent) {
    event?.preventDefault();
    const formData = getFormData<{ todo: string }>(event?.target as HTMLFormElement);
    if (!formData.todo) return;

    onSubmit(formData);
    (event?.target as HTMLFormElement).reset();
  }
  return (
    <form onSubmit={onSubmitHandler} autocomplete="off">
      <input name="todo" type="text" placeholder="Add todo" />
      <button type="submit">Submit</button>
    </form>
  );
}

export function CreateTodo({ onSubmit }: CreateTodoProps) {
  return (
    <div>
      <CreateTodoTitle />
      <CreateTodoForm onSubmit={onSubmit} />
    </div>
  );
}
