import { Fragment, defineComponent } from 'smoljs';
import { CreateTodo, TodoList } from './components';
import type { Todo } from './types';

function AppHeader(): JSX.Element {
  return (
    <header class="app-header">
      <h1>Smol.js Todo</h1>
      <p>A simple TODO app built with Smol.js</p>
    </header>
  );
}

function generateId() {
  return Math.random().toString(36).substring(7);
}

function createTodo(value: string) {
  return {
    value,
    id: generateId(),
    completed: false,
  };
}

export const App = defineComponent({
  state() {
    return {
      todos: [
        { value: 'Buy groceries', completed: false, id: generateId() },
        { value: 'Call mom', completed: false, id: generateId() },
        { value: 'Finish project', completed: true, id: generateId() },
        { value: 'Clean the house', completed: false, id: generateId() },
        { value: 'Read a book', completed: true, id: generateId() },
        { value: 'Walk the dog', completed: false, id: generateId() },
        { value: 'Prepare dinner', completed: false, id: generateId() },
        { value: 'Go to the gym', completed: true, id: generateId() },
        { value: 'Fix the bike', completed: false, id: generateId() },
        { value: 'Plan the weekend trip', completed: false, id: generateId() },
      ] satisfies Todo[],
    };
  },
  methods: {
    onSubmit({ todo }: { todo: string }) {
      this.updateState((prevState) => ({
        ...prevState,
        todos: [createTodo(todo), ...prevState.todos],
      }));
    },
    onDelete(idToRemove: Todo['id']) {
      this.updateState((prevState) => ({
        ...prevState,
        todos: prevState.todos.filter(({ id }) => id !== idToRemove),
      }));
    },
    onChange(id: Todo['id'], value: Partial<Pick<Todo, 'value' | 'completed'>>) {
      console.log('onChange', id, value);
      this.updateState((prevState) => {
        const indexToChange = prevState.todos.findIndex((todo) => todo.id === id);
        if (indexToChange === -1) {
          return prevState;
        }
        const newTodos = [...prevState.todos];
        newTodos[indexToChange] = { ...newTodos[indexToChange], ...value };
        return { ...prevState, todos: newTodos };
      });
    },
  },
  render() {
    const state = this.state;
    const onSubmit = this.onSubmit.bind(this);
    const onDelete = this.onDelete.bind(this);
    const onChange = this.onChange.bind(this);

    return (
      <Fragment>
        <div class="app-container">
          <AppHeader />
          <div class="todo-list">
            <CreateTodo onSubmit={onSubmit} />
            <hr />
            <TodoList onChange={onChange} onDelete={onDelete} todos={state.todos} />
            <div class="todo-stats">
              {state.todos.filter((t) => !t.completed).length} items left
            </div>
          </div>
        </div>
      </Fragment>
    );
  },
});
