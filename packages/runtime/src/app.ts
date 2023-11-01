import { destroyDOM } from './destroy-dom';
import { Dispatcher } from './dispatcher';
import { mountDOM } from './mount-dom';
import { patchDOM } from './patch-dom';
import { FragmentVNode, VNode } from './h';

type EmitFn = (eventName: string, payload: any) => void;

type CreateAppParams<TState extends Record<string, any> = Record<string, any>> = {
  state: Record<string, any>;
  view: (state: TState, emit: EmitFn) => FragmentVNode;
  reducers: Record<string, any>;
};

export function createApp({ state, view, reducers = {} }: CreateAppParams) {
  let parentEl: Element = null;
  let vdom: VNode = null;
  let isMounted = false;

  const dispatcher = new Dispatcher();
  const subscriptions = [dispatcher.afterEveryCommand(renderApp)];

  function emit(eventName: string, payload: any) {
    dispatcher.dispatch(eventName, payload);
  }

  for (const actionName in reducers) {
    const reducer = reducers[actionName];
    const subs = dispatcher.subscribe(actionName, (payload) => {
      state = reducer(state, payload);
    });
    subscriptions.push(subs);
  }

  function renderApp() {
    const newVdom = view(state, emit);
    vdom = patchDOM(vdom, newVdom, parentEl);
  }

  return {
    mount(_parentEl: Element) {
      if (isMounted) {
        throw new Error('App is already mounted!'); // Ex. 7.2
      }
      parentEl = _parentEl;
      vdom = view(state, emit);
      mountDOM(vdom, parentEl);

      isMounted = true;
    },
    unmount() {
      if (!isMounted) {
        throw new Error('The application is not mounted');
      }
      destroyDOM(vdom);
      vdom = null;
      subscriptions.forEach((unsubscribe) => unsubscribe());
      isMounted = false;
    },
  };
}
