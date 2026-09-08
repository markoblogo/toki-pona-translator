import { r as o, u as s } from "./react-DwPcxjY5.js";
const u = typeof window < "u";
function l({
  children: n,
  config: t,
  enabled: e = !0,
  autoInit: r = !0
}) {
  return u && s(t ?? {}, { enabled: e, autoInit: r }), n ?? null;
}
const d = o.memo(l), g = o.memo(function({
  children: t,
  config: e,
  enabled: r,
  autoInit: i,
  headerSelector: a
}) {
  return u ? l({
    config: {
      ...e,
      toggleMount: e?.toggleMount ?? a,
      toggleMode: e?.toggleMode ?? "inline"
    },
    enabled: r,
    autoInit: i,
    children: t
  }) : t ?? null;
}), x = {
  SitelenLayerNextProvider: d,
  SitelenLayerNextHeaderMount: g
};
export {
  g as SitelenLayerNextHeaderMount,
  d as SitelenLayerNextProvider,
  x as default
};
