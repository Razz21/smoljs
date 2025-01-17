import { Fragment, h } from '@smoljs/runtime';

function compileJSXEvents(props: Record<string, any>) {
  const events: Record<string, any> = {};
  const attributes: Record<string, any> = {};
  for (const key in props) {
    if (key.startsWith('on')) {
      const event = key.slice(2).toLowerCase();
      events[event] = props[key];
    } else {
      attributes[key] = props[key];
    }
  }
  return { on: events, attributes };
}

const transformProps = (props: Record<string, any>) => {
  const { style, className, ...attributes } = props;
  const { on, attributes: otherAttributes } = compileJSXEvents(attributes);
  return { style, class: className, on, ...otherAttributes };
};

function jsx(type: any, props: Record<string, any>, key: any) {
  if (arguments.length > 2) {
    props.key = key;
  }

  // TODO: children props are not supported in the core yet
  if (typeof type === 'function' && type !== Fragment) {
    return h(type, props);
  }
  const { children = [] } = props ?? {};
  // TODO: test impact of delete keyword against V8 hidden classes pattern
  // https://v8.dev/docs/hidden-classes
  delete props.children;

  return h(type, transformProps(props), children);
}

export { Fragment, jsx, jsx as jsxs, jsx as jsxDEV };
export * from './types';
