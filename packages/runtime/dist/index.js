function L(e, t, n, r = null) {
  const s = (...o) => {
    r ? t.apply(r, o) : t(...o);
  };
  return n.addEventListener(e, s), s;
}
function _(e = {}, t, n = null) {
  const r = {};
  return Object.entries(e).forEach(([s, o]) => {
    const i = L(s, o, t, n);
    r[s] = i;
  }), r;
}
function z(e, t) {
  Object.entries(e).forEach(([n, r]) => {
    t.removeEventListener(n, r);
  });
}
function K(e) {
  return e.filter((t) => t != null);
}
function H(e, t) {
  return {
    added: t.filter((n) => !e.includes(n)),
    removed: e.filter((n) => !t.includes(n))
  };
}
const l = {
  ADD: "add",
  REMOVE: "remove",
  MOVE: "move",
  NOOP: "noop"
};
class W {
  #e;
  #t;
  #n;
  constructor(t, n) {
    this.#e = [...t], this.#t = t.map((r, s) => s), this.#n = n;
  }
  get length() {
    return this.#e.length;
  }
  isRemovedFromArray(t, n) {
    if (t >= this.length) return !1;
    const r = this.#n, s = this.#e;
    return !n.some((o) => r(s[t], o));
  }
  isUnchangedItem(t, n) {
    return t >= this.length ? !1 : this.#n(this.#e[t], n[t]);
  }
  removeItem(t) {
    const [n] = this.#e.splice(t, 1), [r] = this.#t.splice(t, 1);
    return {
      op: l.REMOVE,
      index: t,
      item: n,
      originalIndex: r
    };
  }
  addItem(t, n) {
    return this.#e.splice(n, 0, t), this.#t.splice(n, 0, -1), {
      op: l.ADD,
      index: n,
      item: t
    };
  }
  moveItem(t, n) {
    const r = this.#e.findIndex((i) => this.#n(i, t));
    if (r === -1) throw new Error("Item not found");
    const [s] = this.#e.splice(r, 1), [o] = this.#t.splice(r, 1);
    return this.#e.splice(n, 0, s), this.#t.splice(n, 0, o), {
      op: l.MOVE,
      from: r,
      index: n,
      item: s,
      originalIndex: o
    };
  }
  removeRemainingItems(t) {
    const n = [];
    for (; this.length > t; )
      n.push(this.removeItem(t));
    return n;
  }
  findItemIndex(t, n) {
    const r = this.length, s = this.#n, o = this.#e;
    if (n < 0 || n >= r)
      return -1;
    for (let i = n; i < r; i++)
      if (s(t, o[i]))
        return i;
    return -1;
  }
  noopItem(t) {
    return {
      op: l.NOOP,
      index: t,
      item: this.#e[t],
      originalIndex: this.#t[t]
    };
  }
}
function Z(e, t, n = (r, s) => r === s) {
  const r = [], s = new W(e, n);
  for (let o = 0; o < t.length; o++) {
    const i = t[o];
    if (s.isRemovedFromArray(o, t)) {
      r.push(s.removeItem(o)), o--;
      continue;
    }
    if (s.isUnchangedItem(o, t)) {
      r.push(s.noopItem(o));
      continue;
    }
    if (s.findItemIndex(i, o) === -1) {
      r.push(s.addItem(i, o));
      continue;
    }
    r.push(s.moveItem(i, o));
  }
  return r.push(...s.removeRemainingItems(t.length)), r;
}
function N() {
}
function M(e, t) {
  if (e.type !== t.type)
    return !1;
  const {
    type: n,
    props: { key: r }
  } = e, {
    type: s,
    props: { key: o }
  } = t;
  return n === s && r === o;
}
function w(e = {}, t = {}) {
  const n = Object.keys(e), r = Object.keys(t);
  return {
    added: r.filter((s) => !(s in e)),
    removed: n.filter((s) => !(s in t)),
    updated: r.filter((s) => s in e && e[s] !== t[s])
  };
}
function G(e, t) {
  return Object.prototype.hasOwnProperty.call(e, t);
}
const J = Function.call.bind(Object.prototype.isPrototypeOf);
function y(e) {
  if (!e.children || v(e))
    return [];
  const t = [];
  for (const n of e.children)
    g(n) ? t.push(...y(n)) : t.push(n);
  return t;
}
function A(e) {
  return e.trim() !== "";
}
function R(e) {
  return e.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}
function Q(e, t) {
  const { class: n, style: r, ...s } = t;
  n && X(e, n), r && Object.entries(r).forEach(([o, i]) => {
    b(e, o, i);
  });
  for (const [o, i] of Object.entries(
    s
  ))
    j(e, o, i);
}
function X(e, t) {
  e.className = "", typeof t == "string" ? e.className = t : Array.isArray(t) && e.classList.add(...t.filter(A));
}
function b(e, t, n) {
  e.style.setProperty(R(t), n);
}
function Y(e, t) {
  e.style.removeProperty(R(t));
}
function j(e, t, n) {
  n == null ? T(e, t) : t.startsWith("data-") ? e.setAttribute(t, n) : e[t] = n;
}
function T(e, t) {
  e[t] = null, e.removeAttribute(t);
}
function a(e, t, n, r) {
  if (S(e))
    st(e, t, n);
  else if (v(e))
    tt(e, t, n);
  else if (g(e))
    rt(e, t, n, r);
  else if (I(e))
    et(e, t, n, r);
  else
    throw new Error(`Cannot mount unknown VNode type: ${e.type}`);
}
function tt(e, t, n) {
  const { props: r } = e, s = document.createTextNode(r.nodeValue);
  e.el = s, q(s, t, n);
}
function et(e, t, n, r) {
  const { type: s, children: o } = e, i = document.createElement(s);
  e.el = i, nt(i, e, r), o.forEach((c) => {
    a(c, i, null, r);
  }), q(i, t, n);
}
function nt(e, t, n) {
  const { on: r = {}, ...s } = t.props, { key: o, ...i } = s;
  t.listeners = _(r, e, n), Q(e, i);
}
function rt(e, t, n, r) {
  const { children: s } = e;
  e.el = t, s.forEach((o, i) => {
    a(o, t, n ? n + i : null, r);
  });
}
function st(e, t, n) {
  const r = e.type, s = e.props, o = new r(s, e.children);
  o.mount(t, n), e.component = o, e.el = o.firstElement;
}
function q(e, t, n) {
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
  const { added: r, removed: s, updated: o } = w(t, n);
  s.forEach((i) => T(e, i)), [...r, ...o].forEach((i) => j(e, i, n[i]));
}
function it(e, t, n) {
  const r = P(t), s = P(n), o = [.../* @__PURE__ */ new Set([...e.classList, ...r])], { added: i, removed: c } = H(o, s);
  e.classList.remove(...c), e.classList.add(...i);
}
function P(e = "") {
  return Array.isArray(e) ? e.filter(A) : e.split(/\s+/).filter(A);
}
function ct(e, t = {}, n = {}, r = {}, s) {
  const { added: o, removed: i, updated: c } = w(n, r);
  [...i, ...c].forEach(
    (u) => e.removeEventListener(u, t[u])
  );
  const f = {};
  return [...o, ...c].forEach((u) => {
    f[u] = L(u, r[u], e, s);
  }), f;
}
function ut(e, t, n) {
  const { added: r, removed: s, updated: o } = w(t, n);
  s.forEach((i) => Y(e, i)), [...r, ...o].forEach((i) => b(e, i, n[i]));
}
function C(e, t, n, r) {
  if (!M(e, t)) {
    const s = Array.from(n.childNodes).indexOf(e.el);
    return h(e), a(t, n, s, r), t;
  }
  return t.el = e.el, v(t) ? (ft(e, t), t) : S(t) ? (at(e, t), t) : (I(t) && lt(e, t, r), pt(e, t, r), t);
}
function ft(e, t) {
  const { el: n } = e, { nodeValue: r } = e.props, { nodeValue: s } = t.props;
  r !== s && (n.nodeValue = s);
}
function lt(e, t, n) {
  const r = e.el, { class: s, style: o, on: i, ...c } = e.props, { class: f, style: u, on: d, ...m } = t.props;
  ot(r, c, m), it(r, s, f), ut(r, o, u), t.listeners = ct(r, e.listeners, i, d, n);
}
function at(e, t) {
  const { component: n } = e, { key: r, ...s } = t.props;
  n.updateProps(s), t.component = n, t.el = n.firstElement;
}
function pt(e, t, n) {
  const r = y(e), s = y(t), o = e.el;
  Z(r, s, M).forEach(({ op: c, index: f, originalIndex: u, item: d }) => {
    const m = n?.offset ?? 0;
    switch (c) {
      case l.ADD:
        a(d, o, f + m, n);
        break;
      case l.REMOVE:
        h(d);
        break;
      case l.MOVE: {
        const B = o.childNodes[f + m];
        o.insertBefore(r[u].el, B), C(r[u], s[f], o, n);
        break;
      }
      case l.NOOP:
        C(r[u], s[f], o, n);
        break;
    }
  });
}
function ht(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var O, k;
function dt() {
  return k || (k = 1, O = function e(t, n) {
    if (t === n) return !0;
    if (t && n && typeof t == "object" && typeof n == "object") {
      if (t.constructor !== n.constructor) return !1;
      var r, s, o;
      if (Array.isArray(t)) {
        if (r = t.length, r != n.length) return !1;
        for (s = r; s-- !== 0; )
          if (!e(t[s], n[s])) return !1;
        return !0;
      }
      if (t.constructor === RegExp) return t.source === n.source && t.flags === n.flags;
      if (t.valueOf !== Object.prototype.valueOf) return t.valueOf() === n.valueOf();
      if (t.toString !== Object.prototype.toString) return t.toString() === n.toString();
      if (o = Object.keys(t), r = o.length, r !== Object.keys(n).length) return !1;
      for (s = r; s-- !== 0; )
        if (!Object.prototype.hasOwnProperty.call(n, o[s])) return !1;
      for (s = r; s-- !== 0; ) {
        var i = o[s];
        if (!e(t[i], n[i])) return !1;
      }
      return !0;
    }
    return t !== t && n !== n;
  }), O;
}
var mt = dt();
const D = /* @__PURE__ */ ht(mt);
class V {
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
    return this.#t ? g(this.#t) ? this.#u() : [this.#t.el] : [];
  }
  get firstElement() {
    return this.elements[0] ?? null;
  }
  get offset() {
    return g(this.#t) ? Array.from(this.#n.childNodes).indexOf(this.firstElement) : 0;
  }
  updateProps(t) {
    const n = { ...this.props, ...t };
    D(this.props, n) || (this.props = n, this.#s());
  }
  updateState(t) {
    const n = typeof t == "function" ? t(this.state) : { ...this.state, ...t };
    D(this.state, n) || (this.state = n, this.#s());
  }
  mount(t, n = null) {
    if (this.#e)
      throw new Error("Component is already mounted");
    this.#t = this.render(), a(this.#t, t, n, this), this.#i(), this.#n = t, this.#e = !0, this.onMounted();
  }
  unmount() {
    if (!this.#e)
      throw new Error("Component is not mounted");
    this.#r = {}, h(this.#t), this.#t = null, this.#n = null, this.#e = !1, this.onUnmounted();
  }
  #s() {
    if (!this.#e)
      throw new Error("Component is not mounted");
    const t = this.render();
    this.#t = C(this.#t, t, this.#n, this), this.onUpdated();
  }
  #i() {
    this.#o(this.#t), this.children.forEach((t) => {
      t.ref && this.#o(t);
    });
  }
  #o(t) {
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
    return y(this.#t).flatMap((t) => F(t.type) ? t.component.elements : t.el);
  }
}
function vt({
  render: e,
  state: t,
  methods: n,
  onMounted: r = N,
  onUnmounted: s = N,
  onUpdated: o = N
}) {
  class i extends V {
    constructor(f, u) {
      super(f, u), this.state = t ? t(f) : {};
    }
    render() {
      return e.call(this, this.props, { children: this.children });
    }
    onMounted() {
      return Promise.resolve(r.call(this));
    }
    onUnmounted() {
      return Promise.resolve(s.call(this));
    }
    onUpdated() {
      return Promise.resolve(o.call(this));
    }
  }
  for (const c in n) {
    if (G(i, c) || c in i.prototype)
      throw new Error(`Method "${c}()" already exists in the component. Can't override`);
    i.prototype[c] = n[c];
  }
  return i;
}
function yt(e) {
  return e.map((t) => p(t) ? t : gt(String(t)));
}
function Et(e) {
  return Array.isArray(e) || (e = [e]), yt(K(e));
}
const $ = Symbol.for("text"), U = Symbol.for("fragment");
function E(e, t, n) {
  const { ref: r, ...s } = t ?? {}, o = Et(n || []);
  return {
    _isVNode: !0,
    type: e,
    props: s,
    children: o,
    ref: typeof r == "string" ? r : null,
    el: null,
    listeners: null,
    component: null
  };
}
function gt(e) {
  return E($, { nodeValue: e });
}
function Nt(e) {
  return E(U, null, e);
}
function p(e) {
  return e ? e?._isVNode === !0 : !1;
}
function v(e) {
  return p(e) && e.type === $;
}
function g(e) {
  return p(e) && e.type === U;
}
function I(e) {
  return p(e) && typeof e.type == "string";
}
function S(e) {
  return p(e) && F(e.type);
}
function F(e) {
  return x(e) && J(V, e);
}
function x(e) {
  return typeof e == "function";
}
function h(e) {
  S(e) ? Ot(e) : At(e);
}
function Ot(e) {
  e.component?.unmount();
}
function At(e) {
  const { el: t, children: n, listeners: r } = e;
  r && (t instanceof Element && z(r, t), e.listeners = null), n.forEach(h), t?.remove();
}
function Ct(e, t, n) {
  if (typeof e == "string" || F(e))
    return E(e, t, n);
  if (x(e))
    return e(t, { children: n });
  throw new Error(
    `Invalid component type passed to "h": expected a string, class component, or function component but received ${typeof e} (${e}).`
  );
}
function wt(e) {
  return Nt(e);
}
function It(e, t = null) {
  let n = null, r = !1, s = null;
  function o() {
    n = null, r = !1, s = null;
  }
  return {
    mount(i) {
      if (!i) {
        console.warn("createApp.mount(): Element does not exists.");
        return;
      }
      if (r)
        throw new Error("The application is already mounted");
      n = i, s = Ct(e, t), a(s, n), r = !0;
    },
    unmount() {
      if (!r)
        throw new Error("The application is not mounted");
      h(s), o();
    }
  };
}
function St(e, { children: t }) {
  return wt(t);
}
export {
  V as Component,
  St as Fragment,
  U as FragmentVNode,
  $ as TextVNode,
  It as createApp,
  Nt as createFragmentVNode,
  gt as createTextVNode,
  E as createVNode,
  vt as defineComponent,
  Ct as h,
  wt as hFragment,
  F as isClassComponent,
  S as isClassComponentVNode,
  I as isElementVNode,
  g as isFragmentVNode,
  x as isFunctionComponent,
  v as isTextVNode,
  p as isVNode
};
//# sourceMappingURL=index.js.map
