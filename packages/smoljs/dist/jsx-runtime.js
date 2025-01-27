import { Fragment as c, h as o } from "./index.js";
function i(t) {
  const e = {}, s = {};
  for (const n in t)
    if (n.startsWith("on")) {
      const r = n.slice(2).toLowerCase();
      e[r] = t[n];
    } else
      s[n] = t[n];
  return { on: e, attributes: s };
}
const u = (t) => {
  const { style: e, className: s, ...n } = t, { on: r, attributes: a } = i(n);
  return { style: e, class: s, on: r, ...a };
};
function l(t, e, s) {
  if (arguments.length > 2 && (e.key = s), typeof t == "function" && t !== c)
    return o(t, e);
  const { children: n = [] } = e ?? {};
  return delete e.children, o(t, u(e), n);
}
export {
  c as Fragment,
  l as jsx,
  l as jsxDEV,
  l as jsxs
};
