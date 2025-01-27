function k(e, t, n, r = null) {
  const o = (...s) => {
    r ? t.apply(r, s) : t(...s);
  };
  return n.addEventListener(e, o), o;
}
function B(e = {}, t, n = null) {
  const r = {};
  return Object.entries(e).forEach(([o, s]) => {
    const i = k(o, s, t, n);
    r[o] = i;
  }), r;
}
function z(e, t) {
  Object.entries(e).forEach(([n, r]) => {
    t.removeEventListener(n, r);
  });
}
function W(e) {
  return e.filter((t) => t != null);
}
function Z(e, t) {
  return {
    added: t.filter((n) => !e.includes(n)),
    removed: e.filter((n) => !t.includes(n))
  };
}
const a = {
  ADD: "add",
  REMOVE: "remove",
  MOVE: "move",
  NOOP: "noop"
};
class q {
  #e;
  #t;
  #n;
  constructor(t, n) {
    this.#e = [...t], this.#t = t.map((r, o) => o), this.#n = n;
  }
  get length() {
    return this.#e.length;
  }
  isRemovedFromArray(t, n) {
    if (t >= this.length) return !1;
    const r = this.#n, o = this.#e;
    return !n.some((s) => r(o[t], s));
  }
  isUnchangedItem(t, n) {
    return t >= this.length ? !1 : this.#n(this.#e[t], n[t]);
  }
  removeItem(t) {
    const [n] = this.#e.splice(t, 1), [r] = this.#t.splice(t, 1);
    return {
      op: a.REMOVE,
      index: t,
      item: n,
      originalIndex: r
    };
  }
  addItem(t, n) {
    return this.#e.splice(n, 0, t), this.#t.splice(n, 0, -1), {
      op: a.ADD,
      index: n,
      item: t
    };
  }
  moveItem(t, n) {
    const r = this.#e.findIndex((i) => this.#n(i, t));
    if (r === -1) throw new Error("Item not found");
    const [o] = this.#e.splice(r, 1), [s] = this.#t.splice(r, 1);
    return this.#e.splice(n, 0, o), this.#t.splice(n, 0, s), {
      op: a.MOVE,
      from: r,
      index: n,
      item: o,
      originalIndex: s
    };
  }
  removeRemainingItems(t) {
    const n = [];
    for (; this.length > t; )
      n.push(this.removeItem(t));
    return n;
  }
  findItemIndex(t, n) {
    const r = this.length, o = this.#n, s = this.#e;
    if (n < 0 || n >= r)
      return -1;
    for (let i = n; i < r; i++)
      if (o(t, s[i]))
        return i;
    return -1;
  }
  noopItem(t) {
    return {
      op: a.NOOP,
      index: t,
      item: this.#e[t],
      originalIndex: this.#t[t]
    };
  }
}
function G(e, t, n = (r, o) => r === o) {
  const r = [], o = new q(e, n);
  for (let s = 0; s < t.length; s++) {
    const i = t[s];
    if (o.isRemovedFromArray(s, t)) {
      r.push(o.removeItem(s)), s--;
      continue;
    }
    if (o.isUnchangedItem(s, t)) {
      r.push(o.noopItem(s));
      continue;
    }
    if (o.findItemIndex(i, s) === -1) {
      r.push(o.addItem(i, s));
      continue;
    }
    r.push(o.moveItem(i, s));
  }
  return r.push(...o.removeRemainingItems(t.length)), r;
}
function E() {
}
function M(e, t) {
  if (e.type !== t.type)
    return !1;
  const {
    type: n,
    props: { key: r }
  } = e, {
    type: o,
    props: { key: s }
  } = t;
  return n === o && r === s;
}
function w(e = {}, t = {}) {
  const n = Object.keys(e), r = Object.keys(t);
  return {
    added: r.filter((o) => !(o in e)),
    removed: n.filter((o) => !(o in t)),
    updated: r.filter((o) => o in e && e[o] !== t[o])
  };
}
function H(e, t) {
  return Object.prototype.hasOwnProperty.call(e, t);
}
const J = Function.call.bind(Object.prototype.isPrototypeOf);
function m(e) {
  if (!e.children || x(e))
    return [];
  const t = [];
  for (const n of e.children)
    y(n) ? t.push(...m(n)) : t.push(n);
  return t;
}
function v(e) {
  return e.trim() !== "";
}
function S(e) {
  return e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function K(e, t) {
  const { class: n, style: r, ...o } = t;
  n && Q(e, n), r && Object.entries(r).forEach(([s, i]) => {
    F(e, s, i);
  });
  for (const [s, i] of Object.entries(
    o
  ))
    R(e, s, i);
}
function Q(e, t) {
  e.className = "", typeof t == "string" ? e.className = t : Array.isArray(t) && e.classList.add(...t.filter(v));
}
function F(e, t, n) {
  e.style.setProperty(S(t), n);
}
function X(e, t) {
  e.style.removeProperty(S(t));
}
function R(e, t, n) {
  n == null ? $(e, t) : t.startsWith("data-") ? e.setAttribute(t, n) : e[t] = n;
}
function $(e, t) {
  e[t] = null, e.removeAttribute(t);
}
function f(e, t, n, r) {
  if (N(e))
    rt(e, t, n);
  else if (x(e))
    Y(e, t, n);
  else if (y(e))
    nt(e, t, n, r);
  else if (I(e))
    tt(e, t, n, r);
  else
    throw new Error(`Cannot mount unknown VNode type: ${e.type}`);
}
function Y(e, t, n) {
  const { props: r } = e, o = document.createTextNode(r.nodeValue);
  e.el = o, L(o, t, n);
}
function tt(e, t, n, r) {
  const { type: o, children: s } = e, i = document.createElement(o);
  e.el = i, et(i, e, r), s.forEach((c) => {
    f(c, i, null, r);
  }), L(i, t, n);
}
function et(e, t, n) {
  const { on: r = {}, ...o } = t.props, { key: s, ...i } = o;
  t.listeners = B(r, e, n), K(e, i);
}
function nt(e, t, n, r) {
  const { children: o } = e;
  e.el = t, o.forEach((s, i) => {
    f(s, t, n ? n + i : null, r);
  });
}
function rt(e, t, n) {
  const r = e.type, o = e.props, s = new r(o, e.children);
  s.mount(t, n), e.component = s, e.el = s.firstElement;
}
function L(e, t, n) {
  if (n == null) {
    t.append(e);
    return;
  }
  if (n < 0)
    throw new Error(`Index must be a non-negative integer, got ${n}`);
  const r = t.childNodes;
  n >= r.length ? t.append(e) : t.insertBefore(e, r[n]);
}
function ot(e, t, n) {
  const { added: r, removed: o, updated: s } = w(t, n);
  o.forEach((i) => $(e, i)), [...r, ...s].forEach((i) => R(e, i, n[i]));
}
function st(e, t, n) {
  const r = A(t), o = A(n), s = [.../* @__PURE__ */ new Set([...e.classList, ...r])], { added: i, removed: c } = Z(s, o);
  e.classList.remove(...c), e.classList.add(...i);
}
function A(e = "") {
  return Array.isArray(e) ? e.filter(v) : e.split(/\s+/).filter(v);
}
function it(e, t = {}, n = {}, r = {}, o) {
  const { added: s, removed: i, updated: c } = w(n, r);
  [...i, ...c].forEach(
    (u) => e.removeEventListener(u, t[u])
  );
  const l = {};
  return [...s, ...c].forEach((u) => {
    l[u] = k(u, r[u], e, o);
  }), l;
}
function ct(e, t, n) {
  const { added: r, removed: o, updated: s } = w(t, n);
  o.forEach((i) => X(e, i)), [...r, ...s].forEach((i) => F(e, i, n[i]));
}
function O(e, t, n, r) {
  if (!M(e, t)) {
    const o = Array.from(n.childNodes).indexOf(e.el);
    return p(e), f(t, n, o, r), t;
  }
  return t.el = e.el, x(t) ? (ut(e, t), t) : N(t) ? (at(e, t), t) : (I(t) && lt(e, t, r), ft(e, t, r), t);
}
function ut(e, t) {
  const { el: n } = e, { nodeValue: r } = e.props, { nodeValue: o } = t.props;
  r !== o && (n.nodeValue = o);
}
function lt(e, t, n) {
  const r = e.el, { class: o, style: s, on: i, ...c } = e.props, { class: l, style: u, on: d, ...g } = t.props;
  ot(r, c, g), st(r, o, l), ct(r, s, u), t.listeners = it(r, e.listeners, i, d, n);
}
function at(e, t) {
  const { component: n } = e, { key: r, ...o } = t.props;
  n.updateProps(o), t.component = n, t.el = n.firstElement;
}
function ft(e, t, n) {
  const r = m(e), o = m(t), s = e.el;
  G(r, o, M).forEach(({ op: i, index: c, originalIndex: l, item: u }) => {
    const d = n?.offset ?? 0;
    switch (i) {
      case a.ADD:
        f(u, s, c + d, n);
        break;
      case a.REMOVE:
        p(u);
        break;
      case a.MOVE: {
        const g = s.childNodes[c + d];
        s.insertBefore(r[l].el, g), O(r[l], o[c], s, n);
        break;
      }
      case a.NOOP:
        O(r[l], o[c], s, n);
        break;
    }
  });
}
function ht(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var j, C;
function pt() {
  return C || (C = 1, j = function e(t, n) {
    if (t === n) return !0;
    if (t && n && typeof t == "object" && typeof n == "object") {
      if (t.constructor !== n.constructor) return !1;
      var r, o, s;
      if (Array.isArray(t)) {
        if (r = t.length, r != n.length) return !1;
        for (o = r; o-- !== 0; )
          if (!e(t[o], n[o])) return !1;
        return !0;
      }
      if (t.constructor === RegExp) return t.source === n.source && t.flags === n.flags;
      if (t.valueOf !== Object.prototype.valueOf) return t.valueOf() === n.valueOf();
      if (t.toString !== Object.prototype.toString) return t.toString() === n.toString();
      if (s = Object.keys(t), r = s.length, r !== Object.keys(n).length) return !1;
      for (o = r; o-- !== 0; )
        if (!Object.prototype.hasOwnProperty.call(n, s[o])) return !1;
      for (o = r; o-- !== 0; ) {
        var i = s[o];
        if (!e(t[i], n[i])) return !1;
      }
      return !0;
    }
    return t !== t && n !== n;
  }), j;
}
var dt = pt();
const P = /* @__PURE__ */ ht(dt);
class U {
  #e = !1;
  #t = null;
  #n = null;
  state;
  props;
  children;
  #r = {};
  constructor(t, n) {
    this.props = t ?? {}, this.children = n ?? [];
  }
  get $refs() {
    return this.#r;
  }
  get elements() {
    return this.#t ? y(this.#t) ? this.#u() : [this.#t.el] : [];
  }
  get firstElement() {
    return this.elements[0] ?? null;
  }
  get offset() {
    return y(this.#t) ? Array.from(this.#n.childNodes).indexOf(this.firstElement) : 0;
  }
  updateProps(t) {
    const n = { ...this.props, ...t };
    P(this.props, n) || (this.props = n, this.#o());
  }
  updateState(t) {
    const n = typeof t == "function" ? t(this.state) : { ...this.state, ...t };
    P(this.state, n) || (this.state = n, this.#o());
  }
  mount(t, n = null) {
    if (this.#e)
      throw new Error("Component is already mounted");
    this.#t = this.render(), f(this.#t, t, n, this), this.#i(), this.#n = t, this.#e = !0, this.onMounted();
  }
  unmount() {
    if (!this.#e)
      throw new Error("Component is not mounted");
    this.#r = {}, p(this.#t), this.#t = null, this.#n = null, this.#e = !1, this.onUnmounted();
  }
  #o() {
    if (!this.#e)
      throw new Error("Component is not mounted");
    const t = this.render();
    this.#t = O(this.#t, t, this.#n, this), this.onUpdated();
  }
  #i() {
    this.#s(this.#t), this.children.forEach((t) => {
      t.ref && this.#s(t);
    });
  }
  #s(t) {
    I(t) && t.ref && this.#c(t.ref, t.el);
  }
  #c(t, n) {
    if (this.#r[t]) {
      console.warn(`Ref "${t}" already exists`);
      return;
    }
    this.#r[t] = n;
  }
  #u() {
    return m(this.#t).flatMap((t) => V(t.type) ? t.component.elements : t.el);
  }
}
function xt({
  render: e,
  state: t,
  methods: n,
  onMounted: r = E,
  onUnmounted: o = E,
  onUpdated: s = E
}) {
  class i extends U {
    constructor(l, u) {
      super(l, u), this.state = t ? t(l) : {};
    }
    render() {
      return e.call(this, this.props, { children: this.children });
    }
    onMounted() {
      return Promise.resolve(r.call(this));
    }
    onUnmounted() {
      return Promise.resolve(o.call(this));
    }
    onUpdated() {
      return Promise.resolve(s.call(this));
    }
  }
  for (const c in n) {
    if (H(i, c) || c in i.prototype)
      throw new Error(`Method "${c}()" already exists in the component. Can't override`);
    i.prototype[c] = n[c];
  }
  return i;
}
function mt(e) {
  return e.map((t) => h(t) ? t : gt(String(t)));
}
function yt(e) {
  return Array.isArray(e) || (e = [e]), mt(W(e));
}
const D = Symbol.for("text"), T = Symbol.for("fragment");
function b(e, t, n) {
  const { ref: r, ...o } = t ?? {}, s = yt(n || []);
  return {
    _isVNode: !0,
    type: e,
    props: o,
    children: s,
    ref: typeof r == "string" ? r : null,
    el: null,
    listeners: null,
    component: null
  };
}
function gt(e) {
  return b(D, { nodeValue: e });
}
function Et(e) {
  return b(T, null, e);
}
function h(e) {
  return e ? e?._isVNode === !0 : !1;
}
function x(e) {
  return h(e) && e.type === D;
}
function y(e) {
  return h(e) && e.type === T;
}
function I(e) {
  return h(e) && typeof e.type == "string";
}
function N(e) {
  return h(e) && V(e.type);
}
function V(e) {
  return _(e) && J(U, e);
}
function _(e) {
  return typeof e == "function";
}
function p(e) {
  N(e) ? vt(e) : Ot(e);
}
function vt(e) {
  e.component?.unmount();
}
function Ot(e) {
  const { el: t, children: n, listeners: r } = e;
  r && (t instanceof Element && z(r, t), e.listeners = null), n.forEach(p), t?.remove();
}
function wt(e, t, n) {
  if (typeof e == "string" || V(e))
    return b(e, t, n);
  if (_(e))
    return e(t, { children: n });
  throw new Error(
    `Invalid component type passed to "h": expected a string, class component, or function component but received ${typeof e} (${e}).`
  );
}
function bt(e) {
  return Et(e);
}
function It(e, t = null) {
  let n = null, r = !1, o = null;
  function s() {
    n = null, r = !1, o = null;
  }
  return {
    mount(i) {
      if (!i) {
        console.warn("createApp.mount(): Element does not exists.");
        return;
      }
      if (r)
        throw new Error("The application is already mounted");
      n = i, o = wt(e, t), f(o, n), r = !0;
    },
    unmount() {
      if (!r)
        throw new Error("The application is not mounted");
      p(o), s();
    }
  };
}
function Nt(e, { children: t }) {
  return bt(t);
}
export {
  U as Component,
  Nt as Fragment,
  T as FragmentVNode,
  D as TextVNode,
  It as createApp,
  Et as createFragmentVNode,
  gt as createTextVNode,
  b as createVNode,
  xt as defineComponent,
  wt as h,
  bt as hFragment,
  V as isClassComponent,
  N as isClassComponentVNode,
  I as isElementVNode,
  y as isFragmentVNode,
  _ as isFunctionComponent,
  x as isTextVNode,
  h as isVNode
};
