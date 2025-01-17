import { getFormData } from '../utils';

type CreateTodoProps = {
  onSubmit: (payload: { todo: string }) => void;
};

function CreateTodoTitle() {
  return <h2 className='todo-input-header'>Create Tasks</h2>;
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
    <form
      className="todo-input-group"
      placeholder="Add a new task..."
      onSubmit={onSubmitHandler}
      autocomplete="off"
    >
      <input name="todo" type="text" className="todo-input" placeholder="Add a new task..." />
      <button className="todo-add-btn" type="submit">
        <span>&#x27A4;</span>
      </button>
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
