import './style.css';
import { ChildrenVNode, defineComponent } from 'simple-vue';
import ComponentJSX, { ComponentFC } from './components/Comp';

function Heading(props: { content?: string; children: ChildrenVNode }): JSX.Element {
  return <h1>{props.children}</h1>;
}

function TodoListPlaceholder() {
  return <ComponentJSX name="23">123</ComponentJSX>;
}

export const App = defineComponent({
  state() {
    return {
      todos: [] as string[],
    };
  },
  render() {
    return (
      <div>
        <Heading>Hello world</Heading>
      </div>
    );
  },
});
