# @smoljs/router

A simple router for `Smoljs` applications.

## Usage

### Define Routes

Create a file to define your routes:

```typescript
// src/routes.ts
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Profile, ProfileID } from './pages/Profile';
import { Page404 } from './pages/404';
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
  {
    path: '/profile',
    component: Profile,
    children: [
      {
        path: "/:id",
        component: ProfileID
      },
    ]
  },
  {
    path: '*any',
    component: Page404,
  },
] as const satisfies Route[];
```

Package uses [`path-to-regexp`](https://github.com/pillarjs/path-to-regexp/) library to match paths. You can use dynamic segments in your paths by using `:name` syntax. For example, `/profile/:id` will match `/profile/1`, `/profile/2`, etc. For the best experience and type safety all paths should start with a leading slash `/`.


> [!NOTE] Managing Routes 
> Order of routes is important. The first route that matches the current URL will be rendered. If you have a catch-all route, make sure it is the last route in the array.

### Initialize Router

Initialize the router with defined routes:

```typescript
// src/main.ts
import { Router } from '@smoljs/router';
import { createApp } from 'smoljs';
import { App } from './App';
import { routes } from './routes';

const router = Router.create({ routes }).init();

createApp(App).mount(document.querySelector('#app'));
```

The `router.init()` ensures that the router is in sync with the current URL. It should be called after the app is mounted to the DOM.

### Components

#### RouterView

The `RouterView` component is a container that renders the matched page component for the current URL. It should be placed in the root of your application.

```typescript
import { RouterView } from '@smoljs/router';
import { h, createApp } from 'smoljs';

export const App = defineComponent({
  render() {
    return h(RouterRoot)
  },
});

createApp(App).mount(document.querySelector('#app'));
```

#### RouterLink

The `RouterLink` component is a navigation component that renders an anchor `<a>` tag. It should be used to navigate between routes of your application.

```typescript
import { RouterLink } from '@smoljs/router';
import { h } from 'smoljs';

export const App = defineComponent({
  render() {
    return h('nav', [
      h(RouterLink, { to: '/' }, ['Home']),
      h(RouterLink, { to: '/about' }, ['About']),
      h(RouterLink, { to: '/profile/1' }, ['Profile']),
    ]);
  },
});
```

The `RouterLink` property automatically adds the `active` class to the anchor tag when the current URL matches the `to` prop. You can style the `active` class to indicate the current route. 

```css
a.active {
  font-weight: bold;
}
```


You can also use the `exact` prop to match the URL exactly.

```typescript
import { RouterLink } from '@smoljs/router';
import { h } from 'smoljs';

export const App = defineComponent({
  render() {
    return h('nav', [
      h(RouterLink, { to: '/', exact: true }, ['Home']),
      h(RouterLink, { to: '/about',  }, ['About']),
      h(RouterLink, { to: '/profile/1',  }, ['Profile']),
    ]);
  },
});
```

In example above, the Home link will have the `active` class only when the URL hits `/`.

## Type Safety

To ensure type safety across your application, make sure to type `routes` as literal type using const assertions (`as const`) and register your router instance with the `@smoljs/router` module. This is done using declaration merging on the exported `Register` interface. By doing this, the router's types permeate the TypeScript module boundary, allowing you to use the exported components and utilities with your router's exact types.

```typescript
// src/main.ts

const routes = [
  // routes
] as const satisfies Route[];

const router = Router.create({ routes }).init();

declare module '@smoljs/router' {
  interface Register {
    router: typeof router;
  }
}
```

### Type Safe Navigation

`@smoljs/router` router instance provides a basic utility functions `push` and `replace` that allows you to navigate to a new URL. These function are type-safe and will ensure that the URL you are navigating to matches one of the routes you have defined.

```typescript
import { useRouter } from '@smoljs/router';

const router = useRouter();

router.push('/about');

// or with dynamic segments

router.push('/profile/1');

// alternatively, use path route object and a raw pathname property 

router.push({ pathname: '/profile/:id', params: { id: 1 } });

```

> [!NOTE] RouterLink component and paths 
> Currently `RouterLink` component does not support path route object. It is recommended to use raw string path instead.
> 
> ```typescript
> import { RouterLink } from '@smoljs/router';
> import { h } from 'smoljs';
>
> h(RouterLink, { to: '/profile/123' }, ['About'])
> ```


## Full Example

For a complete example, including navigation and router components, see the [examples/router](../../examples/router) module.


## TODO
- [ ] Add support for query parameters