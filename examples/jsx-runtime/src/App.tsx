import { defineComponent, Fragment } from 'simple-vue';
import { CreateTodo, TodoList } from './components';
import { Todo } from './types';

function Heading(props: { children: JSX.Element }): JSX.Element {
  return <h1>{props.children}</h1>;
}

function TodoListPlaceholder() {
  return <div>No todos to display, add one!</div>;
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
        {
          value: 'Buy milk',
          id: generateId(),
          completed: false,
        },
      ] as Todo[],
    };
  },
  render(props: { title: string }) {
    const state = this.state;
    const onSubmit = ({ todo }: { todo: string }) => {
      this.updateState((prevState) => ({
        ...prevState,
        todos: [...prevState.todos, createTodo(todo)],
      }));
    };
    const onDelete = (idToRemove: Todo['id']) => {
      this.updateState((prevState) => ({
        ...prevState,
        todos: prevState.todos.filter(({ id }) => id !== idToRemove),
      }));
    };
    const onChange = (id: Todo['id'], value: string) => {
      this.updateState((prevState) => {
        const indexToChange = prevState.todos.findIndex((todo) => todo.id === id);
        if (indexToChange === -1) {
          return prevState;
        }
        const newTodos = [...prevState.todos];
        newTodos[indexToChange] = { ...newTodos[indexToChange], value };
        return { ...prevState, todos: newTodos };
      });
    };
    return (
      <Fragment>
        <Heading>{props.title}</Heading>
        <CreateTodo onSubmit={onSubmit} />
        {state.todos.length > 0 ? (
          <TodoList onDelete={onDelete} onChange={onChange} todos={state.todos} />
        ) : (
          <TodoListPlaceholder />
        )}
      </Fragment>
    );
  },
});
