import { h, Fragment } from '@simple-vue/runtime';

function compileJSXEvents(props: Record<string, any>) {
  const events: Record<string, any> = {};
  const attrs: Record<string, any> = {};
  for (const key in props) {
    if (key.startsWith('on')) {
      const event = key.slice(2).toLowerCase();
      events[event] = props[key];
    } else {
      attrs[key] = props[key];
    }
  }
  return { on: events, attrs };
}

const transformProps = (props: Record<string, any>) => {
  const { style, className, ...attrs } = props;
  const { on, attrs: otherAttrs } = compileJSXEvents(attrs);
  return { style, class: className, on, ...otherAttrs };
};

function jsx(type: any, props: Record<string, any>, key: any) {
  if (arguments.length > 2) {
    props.key = key;
  }

  // FIXME we have to persist the children prop from Function & Class Component to render its child elements,
  // except for <Fragment> which could be handled as a regular element
  if (typeof type === 'function' && type !== Fragment) {
    return h(type, props);
  }
  const { children = [] } = props ?? {};

  delete props.children;

  return h(type, transformProps(props), children);
}

export { Fragment, jsx, jsx as jsxs, jsx as jsxDEV };
export * from './types';
