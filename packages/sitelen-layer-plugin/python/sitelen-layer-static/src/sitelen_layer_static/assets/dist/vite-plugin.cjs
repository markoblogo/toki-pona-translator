"use strict";Object.defineProperties(exports,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}});const c="sitelen-layer-plugin/styles.css",i="contains";function u(e){return[...new Set((e??[]).filter(n=>typeof n=="string"&&n.length>0))].sort()}function a(e){if(e.routeInclude.length===0&&e.routeExclude.length===0)return"";const t=JSON.stringify(e.routeInclude),n=JSON.stringify(e.routeExclude),r=JSON.stringify(e.routeMatchMode);return`
function __slpShouldRun(route) {
  const include = ${t};
  const exclude = ${n};
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
        const match = String(pattern).match(/^\\/(.*)\\/(.*)$/);
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

if (!__slpShouldRun(typeof window === 'undefined' ? '' : (window.location.pathname + window.location.search + window.location.hash).toLowerCase())) { 
  /* route is outside plugin scope */
} else {
`}function s(e){const t={...e.initConfig??{},...e.container?{container:e.container}:{}},n=JSON.stringify(t),r=a({routeInclude:u(e.routeInclude),routeExclude:u(e.routeExclude),routeMatchMode:e.routeMatchMode??i});return r?`import { createSitelenLayerPlugin } from 'sitelen-layer-plugin';
${r}  createSitelenLayerPlugin(${n}).init();
}
`:`import { createSitelenLayerPlugin } from 'sitelen-layer-plugin';
createSitelenLayerPlugin(${n}).init();`}function l(e={}){const t={autoImportStyle:e.autoImportStyle??!0,autoInit:e.autoInit??!1,container:e.container??"",initConfig:e.initConfig??{},styleHref:e.styleHref??c,scriptBody:e.scriptBody??"",injectInto:e.injectInto??"head",routeInclude:u(e.routeInclude),routeExclude:u(e.routeExclude),routeMatchMode:e.routeMatchMode??i};return{name:"sitelen-layer-plugin",apply:"build",transformIndexHtml:n=>{const r=[];if(t.autoImportStyle&&r.push({tag:"link",attrs:{rel:"stylesheet",href:t.styleHref},injectTo:"head"}),t.autoInit){const o=t.scriptBody||s(t);r.push({tag:"script",attrs:{type:"module"},children:o,injectTo:t.injectInto})}return{html:n,tags:r}}}}exports.default=l;exports.sitelenLayerVitePlugin=l;
