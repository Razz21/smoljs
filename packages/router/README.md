# @smoljs/router

A simple and lightweight router for SmolJS applications.

## Usage

### Define Routes

Create a file to define your routes:

```typescript
// src/routes.ts
import { Home } from './pages/Home';
import { About } from './pages/About';
import { type Route } from '@smoljs/router';

export const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/about',
    component: About,
  },
] satisfies Route[];
```

### Initialize Router

Initialize the router with the defined routes:

```typescript
// src/main.ts
import { Router } from '@smoljs/router';
import { createApp } from 'smoljs';
import { App } from './App';
import { routes } from './routes';

const router = Router.create({ routes }).init();

createApp(App).mount(document.querySelector('#app'));
```

### Type Safety

To ensure type safety across your application, you need to register your router instance with the `@smoljs/router` module. This is done using declaration merging on the exported `Register` interface. By doing this, the router's types permeate the TypeScript module boundary, allowing you to use the exported components and utilities with your router's exact types.

```typescript
// src/main.ts
const router = Router.create({ routes }).init();

declare module '@smoljs/router' {
  interface Register {
    router: typeof router;
  }
}
```

### Full Example

For a complete example, including navigation and router components, see the [examples/router](../../examples/router) module.
