const s = "sitelen-layer-plugin/styles.css", y = "contains";
function f(e) {
  return [...new Set((e ?? []).filter((i) => typeof i == "string" && i.length > 0))].sort();
}
function I(e) {
  return e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function m(e) {
  if (e.routeInclude.length === 0 && e.routeExclude.length === 0)
    return "";
  const t = JSON.stringify(e.routeInclude), i = JSON.stringify(e.routeExclude), r = JSON.stringify(e.routeMatchMode);
  return `
function __slpShouldRun(route) {
  const include = ${t};
  const exclude = ${i};
  const mode = ${r};

  function match(value, pattern) {
    if (!pattern) {
      return false;
    }

    if (mode === 'exact') {
      return value === pattern;
    }

    if (mode === 'startsWith') {
      return value.startsWith(pattern);
    }

    if (mode === 'regex') {
      try {
        const match = String(pattern).match(/^/(.*)/(.*)$/);
        const expression = match ? match[1] : String(pattern);
        const flags = match ? match[2] : 'i';
        return new RegExp(expression, flags).test(value);
      } catch (_err) {
        return false;
      }
    }

    return value.includes(pattern);
  }

  const hasInclude = include.length > 0;
  const hasExclude = exclude.length > 0;
  const normalizedRoute = String(route || '').toLowerCase();

  if (hasInclude && !include.some((rule) => match(normalizedRoute, String(rule).toLowerCase()))) {
    return false;
  }

  if (hasExclude && exclude.some((rule) => match(normalizedRoute, String(rule).toLowerCase()))) {
    return false;
  }

  return true;
}
`;
}
function p(e) {
  if (typeof e == "string")
    return [s, e];
  if (Array.isArray(e))
    return e.includes(s) || e.unshift(s), e;
  if (e && typeof e == "object") {
    const t = e;
    Object.entries(t).forEach(([i, r]) => {
      typeof r == "string" ? t[i] = [s, r] : Array.isArray(r) ? r.includes(s) || r.unshift(s) : p(r);
    });
  }
  return e;
}
function $(e) {
  if (e.scriptBody && e.scriptBody.length > 0)
    return e.scriptBody;
  const t = JSON.stringify({
    ...e.initConfig ?? {}
  }), i = m({
    routeInclude: e.routeInclude ?? [],
    routeExclude: e.routeExclude ?? [],
    routeMatchMode: e.routeMatchMode ?? y
  });
  return i ? `;(function() {
  if (typeof window === 'undefined') return;
  ${i}
  if (!__slpShouldRun((window.location.pathname + window.location.search + window.location.hash).toLowerCase())) {
    return;
  }
  import('sitelen-layer-plugin').then(({ createSitelenLayerPlugin }) => {
    createSitelenLayerPlugin(${t}).init();
  });
})();` : `;(function() {
  if (typeof window === 'undefined') return;
  import('sitelen-layer-plugin').then(({ createSitelenLayerPlugin }) => {
    createSitelenLayerPlugin(${t}).init();
  });
})();`;
}
class b {
  constructor(t = {}) {
    this.options = {
      autoInjectStyles: t.autoInjectStyles ?? !0,
      autoInit: t.autoInit ?? !1,
      styleHref: t.styleHref ?? s,
      initConfig: t.initConfig ?? {},
      scriptBody: t.scriptBody,
      routeInclude: f(t.routeInclude),
      routeExclude: f(t.routeExclude),
      routeMatchMode: t.routeMatchMode ?? y
    };
  }
  apply(t) {
    if (!t || !t.options || typeof t.options != "object" || (this.options.autoInjectStyles && (t.options.entry = p(t.options.entry)), !this.options.autoInit))
      return;
    const i = $(this.options), r = `<link rel="stylesheet" href="${this.options.styleHref}" data-sitelen-layer-autoinject-style="true">`, h = `<script type="module" data-sitelen-layer-autoinit="true" data-sitelen-layer-autoinit-source="webpack">${i}<\/script>`, l = /(<\!doctype html>[\s\S]*?<\/head>)/i, g = I(this.options.styleHref), S = new RegExp(`<link[^>]+href=["']${g}["'][^>]*>`, "i"), x = (n) => !this.options.autoInjectStyles || S.test(n) || n.includes('data-sitelen-layer-autoinject-style="true"') ? n : this.options.styleHref === s && l.test(n) ? n.replace(l, `$1${r}`) : /<\/head>/i.test(n) ? n.replace(/<\/head>/i, `${r}</head>`) : /<\/body>/i.test(n) ? n.replace(/<\/body>/i, `${r}</body>`) : n, E = (n) => n.includes('data-sitelen-layer-autoinit="true"') ? n : n.replace(/(<\/body>)/i, `${h}$1`), c = (n, w) => {
      const o = n.hooks[w];
      if (!o)
        return;
      const d = (u) => {
        const a = x(u);
        return E(a);
      };
      if (typeof o.tapAsync == "function") {
        o.tapAsync("SitelenLayerWebpackPlugin", (u, a) => {
          a(null, {
            ...u,
            html: d(u.html)
          });
        });
        return;
      }
      o.tap("SitelenLayerWebpackPlugin", (u) => (u.html = d(u.html), u));
    };
    t.hooks.thisCompilation?.tap("SitelenLayerWebpackPlugin", (n) => {
      c(n, "htmlWebpackPluginBeforeEmit"), c(n, "htmlWebpackPluginBeforeHtmlProcessing"), c(n, "htmlWebpackPluginAfterHtmlProcessing");
    });
  }
}
export {
  b as SitelenLayerWebpackPlugin,
  b as default
};
