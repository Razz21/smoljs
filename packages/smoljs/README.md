# smoljs

`smoljs` is the main entry point for the `Smol.js` framework, providing support for JSX/TSX syntax and seamless integration with the core runtime.

## Features

- **JSX/TSX Support**: Write components using familiar JSX/TSX syntax.
- **@smoljs/runtime**: Provides the core implementation of the framework, including the virtual DOM, component system, and rendering logic.

## JSX/TSX Support

> [!WARNING] JSX/TSX Setup
> Following steps below will guide you through setting up JSX/TSX support in your Vite app. 
> If you're using a different bundler, refer to the respective documentation for JSX/TSX setup.

### Configuration

1. To enable JSX/TSX support in your Vite app, ensure your `tsconfig.json` is configured correctly:

```json
// tsconfig.json

{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxFactory": "jsx",
    "jsxImportSource": "smoljs",
    "jsxFragmentFactory": "Fragment",
    "typeRoots": ["smoljs/jsx-runtime"]
  }
}
```

Since Smol.js uses a custom JSX pragma, you'll need to configure your `tsconfig.json` to use the `jsxImportSource` option to specify the module to import the JSX factory from.

2. Enable JSX compilation with `esbuild`:

Update `vite.config.ts` to use the [`esbuild tsx loader`](https://esbuild.github.io/api/#transformation).

```typescript
// vite.config.ts

import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    loader: 'tsx',
    jsxFactory: 'jsx',
    jsxFragment: 'Fragment',
    jsxImportSource: 'smoljs',
    jsxSideEffects: false,
    jsx: 'automatic',
    jsxDev: false,
  },
});
```

3. Start creating JSX/TSX components:

```tsx
// App.tsx

import { Fragment } from 'smoljs';

const App = () => {
  return (
    <Fragment>
      <h1>Hello, Smol.js!</h1>
      <p>Welcome to the Smol.js framework.</p>
    </Fragment>
  );
};

```

# Caveats

When using the `defineComponent` factory and passing an internal method as a prop to a child component, ensure you explicitly bind the `this` context to the component instance. This is necessary to maintain the correct context for the method when it is invoked.

```tsx
// App.tsx

import { defineComponent } from 'smoljs';
import MyComponent from './MyComponent';

const App = defineComponent({
  methods: {
    handleClick() {
      console.log('Button clicked');
    },
  },
  render() {
    const handleClick = this.handleClick.bind(this);
    return <MyComponent onClick={handleClick} />
  }
})
```
