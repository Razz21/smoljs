# @smoljs/runtime

Core runtime implementation for the Smol.js framework. Provides the virtual DOM engine, component system, and rendering logic.

> This is an internal package used by Smol.js. For building applications, use the [smoljs](../smoljs) package instead.

## Overview

`@smoljs/runtime` implements the foundational building blocks of Smol.js:

- Virtual DOM implementation for efficient DOM updates
- Component lifecycle and state management 
- DOM mounting and patching algorithms

## Reference

### Virtual DOM

- `h(type, props, children)` - Creates a new virtual node, representing a DOM element.
It takes the following arguments:

  - `type` - HTML Element node tag (e.g. `div`, `span`, `h1`), or a component function.
  - `props` - An object containing the node's attributes and event listeners
  - `children` - An array of child nodes or text content

```ts
import { h, defineComponent } from '@smoljs/runtime';

const Component = defineComponent({
  render() {
    return h('div', { class: 'component' }, ["Hello, Smol.js!"]);
  }
});

const vnode = h('div', { id: 'app' }, [
  h('p', null, ['Welcome to the Smol.js framework.']),
  h(Component),
]);
```

- `hFragment(children)` - Creates a new virtual fragment node (array of children)

```ts
import { hFragment } from '@smoljs/runtime';

const vnode = hFragment([
  h('h1', null, ['Hello, Smol.js!']),
  h('p', null, ['Welcome to the Smol.js framework.'])
]);
```

### Component

#### `defineComponent(options)`

Base function for creating a new stateful component. It takes the following arguments:

- `options` - An object containing the component's configuration
  - `state(props, context)` - A function returning the initial state of the component
  - `render(props, context)` - A function returning the virtual DOM node of the component
  - `methods` - An object containing the component's methods
  - lifecycle methods: 
    - `onMounted` - Called when the component is mounted to the DOM
    - `onUpdated` - Called when the component is updated
    - `onUnmounted` - Called when the component is removed from the DOM

```ts
import { defineComponent } from '@smoljs/runtime';

export const App = defineComponent({
  state() {
    return {
      count: 0,
    };
  },
  methods: {
    increment() {
      this.updateState((prevState) => ({ count: prevState.count + 1 }));
    },
    decrement() {
      this.updateState((prevState) => ({ count: prevState.count - 1 }));
    },
  },
  onMounted() {
    console.log('Component mounted');
  },
  onUnmounted() {
      console.log('Component unmounted');
  },
  onUpdated() {
      console.log('Component updated');
  },
  render() {
    const increment = this.increment;
    const decrement = this.decrement;

    return h('div', null, [
      h('div', { class: 'my-app' }, [this.state.count.toString()]),
      h('button', { on: { click: decrement } }, ['-']),
      h('button', { on: { click: increment } }, ['+']),
    ]);
  },
});
```

Component `props` and `children` are available in the `state` and `render` functions as arguments:

```ts
import { defineComponent } from '@smoljs/runtime';

export const App = defineComponent({
  state(props) {
    return {
      count: props.initialCount,
    };
  },
  render(props, { children }) {
    return h('div', { class: props.class }, children);
  },
});
```

To provide Type Safety for component, you have to type the props directly in the `state` or `render` functions:

```ts

interface AppProps {
  initialCount: number;
  class: string;
}

import { defineComponent, h } from '@smoljs/runtime';

export const Component = defineComponent({
  state(props: AppProps) {
    return {
      count: props.initialCount,
    };
  },
  render(props: AppProps, { children }) {
    return h('div', { class: props.class }, children);
  },
});

const vnode = h(Component, { initialCount: 0, class: 'app' }, [ // Props are type checked
  h('h1', null, ['Hello, Smol.js!']),
]);
```

#### `createApp(RootComponent)` 

Creates an application instance

- `RootComponent` - The root component of the application

API
- `mount(element)` - Mounts the application to the DOM element

```ts

import { createApp } from '@smoljs/runtime';

import { App } from './App';

createApp(App).mount(document.querySelector('#app'));
```

#### Function Components

Function components are a type of component used to create stateless components in Smol.js. They offer several performance benefits:

- **Simpler Structure**: As plain functions, they are easier for JavaScript engines to optimize.
- **No State Management Overhead**: Without internal state management, they use less memory and processing power.
- **Reduced Complexity**: Lacking lifecycle methods, they have a simpler execution model, resulting in faster rendering and updates.

Example of a function component:

```ts
import { h } from '@smoljs/runtime';

type HelloWorldProps = {
  message: string;
};

export const HelloWorld = (props: HelloWorldProps, { children }) => {
  return h('div', null, [props.message, ...children]);
};
```

It can be used in other components as regular component:

```ts
import { defineComponent, h } from '@smoljs/runtime';
import { HelloWorld } from './HelloWorld';

const App = defineComponent({
  render() {
    return h(HelloWorld, { message: 'Hello, World!' }, [h('div', null, 'Children content')]);
  },
})
```