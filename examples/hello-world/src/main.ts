import './style.css';
import { createApp, defineComponent, h, hFragment } from 'smoljs';
import { CreateTodo, TodoList } from './components';

function Heading(props: { content: string }) {
  return h('h1', null, [props.content]);
}

function TodoListPlaceholder() {
  return h('div', null, ['No todos to display, add one!']);
}

const App = defineComponent({
  state() {
    return {
      todos: ['Buy milk'],
    };
  },
  render(props: { title: string }) {
    const onSubmit = ({ todo }: { todo: string }) => {
      this.updateState((prevState) => ({ ...prevState, todos: [...prevState.todos, todo] }));
    };
    const onDelete = (indexToRemove: number) => {
      this.updateState((prevState) => ({
        ...prevState,
        todos: prevState.todos.filter((_, i) => i !== indexToRemove),
      }));
    };
    return hFragment([
      Heading({ content: props.title }),
      CreateTodo({ onSubmit }),
      this.state.todos.length > 0
        ? TodoList({ todos: this.state.todos, onDelete })
        : TodoListPlaceholder(),
    ]);
  },
});

createApp(App, { title: 'Hello world from the Smoljs app' }).mount(
  document.querySelector('#app')
);
