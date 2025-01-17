```

   ______     __    __     ______     __           __     ______    
  /\  ___\   /\ "-./  \   /\  __ \   /\ \         /\ \   /\  ___\   
  \ \___  \  \ \ \-./\ \  \ \ \/\ \  \ \ \____   _\_\ \  \ \___  \  
   \/\_____\  \ \_\ \ \_\  \ \_____\  \ \_____\ /\_____\  \/\_____\ 
    \/_____/   \/_/  \/_/   \/_____/   \/_____/ \/_____/   \/_____/ 

```

# What is Smol.js? 

`Smol.js` is yet another smol JavaScript framework for building smol interfaces. TypeScript-flavored.
It provides a simple API for defining smol components. Supports both traditional JavaScript and JSX syntax.

`Smol.js` is inspired by good ol' Vue.js, and you will find many common elements and patterns.

> [!NOTE]
> This project was created purely for learning purposes. It's definitely not ready for production, but if you're the type who enjoys a little adventure and doesn't mind diving into some debugging along the way, you might just enjoy the ride.

# Getting Started

To get started with `Smol.js`, you can clone the repository and run the examples provided.

Prerequisites:
```shell
pnpm install

pnpm build:packages
```

To run the `hello-world` example just go to the `examples/hello-world` directory and run:

```shell
pnpm dev
```

# Examples

## Basic Usage

```typescript
import { createApp, defineComponent, h } from 'smoljs';

const HelloWorld = ({ message }: { message: string }) => {
  return h('div', null, [message]);
};

const App = defineComponent({
  render() {
    return h(HelloWorld, { message: 'Hello, World!' });
  },
});

createApp(App).mount(document.querySelector('#app'));
```

## JSX Usage

```tsx
import { createApp, defineComponent, h } from 'smoljs';

const HelloWorld = ({ message }: { message: string }) => {
  return <div>{message}</div>;
};

const App = defineComponent({
  render() {
    return <HelloWorld message="Hello, World!" />;
  },
});

createApp(App).mount(document.querySelector('#app'));
```

# Project Overview

The `Smol.js` project is organized into several packages:

- `packages/runtime`: Contains the core implementation of the framework, including the virtual DOM, component system, and rendering logic.
- `packages/smoljs`: Provides support for JSX and serves as the main entry point for the framework.

# Architecture

The architecture of `Smol.js` is designed to be modular and extensible. The core concepts include:

- **Virtual DOM**: A lightweight representation of the actual DOM, used to optimize rendering performance.
- **Components**: Reusable building blocks for creating user interfaces. Supports either traditional JavaScript or JSX syntax.
- **State Management**: Simple state management within components, allowing for reactive updates to the UI.

# Flowchart

Below is a high-level flowchart of the `Smol.js` framework:

```plaintext
+---------------------+
|     User Input      |
+---------------------+
          |
          v
+---------------------+
|   Component State   |
+---------------------+
          |
          v
+---------------------+
|   Component Logic   |
+---------------------+
          |
          v
+---------------------+
|    Virtual DOM      |
+---------------------+
          |
          v
+---------------------+
|      Real DOM       |
+---------------------+
```

# License

This project is licensed under the MIT License.