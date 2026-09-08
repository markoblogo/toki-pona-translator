import { createSitelenLayerPlugin as a } from "./sitelen-layer-plugin.js";
function s(r) {
  const i = (n) => n === void 0 ? "__undefined__" : n === null ? "__null__" : typeof n == "function" ? "__function__" : typeof Element < "u" && n instanceof Element ? `element:${n.tagName.toLowerCase()}#${n.id || "no-id"}` : n;
  try {
    return JSON.stringify(r, (n, e) => i(e));
  } catch {
    return "";
  }
}
const l = (r, i = {}) => {
  let n = null, e = "";
  const c = (t = {}) => {
    !(t.autoInit ?? !0) || t.enabled === !1 || typeof window > "u" || (n?.destroy(), n = a({
      ...t,
      container: t.container ?? r
    }), n.init());
  }, u = () => {
    n?.destroy(), n = null, e = "";
  }, f = (t = {}) => {
    const o = s(t);
    e !== o && (u(), c(t), e = o);
  };
  return f(i), {
    update(t = {}) {
      f(t);
    },
    destroy: u
  };
};
export {
  l as default,
  l as sitelenLayerAction
};
