import type { HtmlTagDescriptor, Plugin } from 'vite';
import type { SitelenLayerPluginConfig } from './types';

type RouteMatchMode = 'contains' | 'startsWith' | 'exact' | 'regex';

export interface SitelenLayerVitePluginOptions {
  autoImportStyle?: boolean;
  autoInit?: boolean;
  container?: string;
  initConfig?: SitelenLayerPluginConfig;
  styleHref?: string;
  scriptBody?: string;
  injectInto?: 'head' | 'body';
  routeInclude?: string[];
  routeExclude?: string[];
  routeMatchMode?: RouteMatchMode;
}

const DEFAULT_STYLE_HREF = 'sitelen-layer-plugin/styles.css';

const DEFAULT_ROUTE_MATCH_MODE: RouteMatchMode = 'contains';

function dedupeSortedRoutes(routes?: string[]): string[] {
  const unique = new Set((routes ?? []).filter((route) => typeof route === 'string' && route.length > 0));
  return [...unique].sort();
}

function buildRouteGuardScript(routeConfig: {
  routeInclude: string[];
  routeExclude: string[];
  routeMatchMode: RouteMatchMode;
}): string {
  if (routeConfig.routeInclude.length === 0 && routeConfig.routeExclude.length === 0) {
    return '';
  }

  const include = JSON.stringify(routeConfig.routeInclude);
  const exclude = JSON.stringify(routeConfig.routeExclude);
  const mode = JSON.stringify(routeConfig.routeMatchMode);

  return `\nfunction __slpShouldRun(route) {\n  const include = ${include};\n  const exclude = ${exclude};\n  const mode = ${mode};\n\n  function match(value, pattern) {\n    if (!pattern) {\n      return false;\n    }\n\n    if (mode === 'exact') {\n      return value === pattern;\n    }\n\n    if (mode === 'startsWith') {\n      return value.startsWith(pattern);\n    }\n\n    if (mode === 'regex') {\n      try {\n        const match = String(pattern).match(/^\\/(.*)\\/(.*)$/);\n        const expression = match ? match[1] : String(pattern);\n        const flags = match ? match[2] : 'i';\n        return new RegExp(expression, flags).test(value);\n      } catch (_err) {\n        return false;\n      }\n    }\n\n    return value.includes(pattern);\n  }\n\n  const hasInclude = include.length > 0;\n  const hasExclude = exclude.length > 0;\n  const normalizedRoute = String(route || '').toLowerCase();\n\n  if (hasInclude && !include.some((rule) => match(normalizedRoute, String(rule).toLowerCase()))) {\n    return false;\n  }\n\n  if (hasExclude && exclude.some((rule) => match(normalizedRoute, String(rule).toLowerCase()))) {\n    return false;\n  }\n\n  return true;\n}\n\nif (!__slpShouldRun(typeof window === 'undefined' ? '' : (window.location.pathname + window.location.search + window.location.hash).toLowerCase())) { \n  /* route is outside plugin scope */\n} else {\n`;
}

function createInitCode(options: SitelenLayerVitePluginOptions): string {
  const initConfig = {
    ...(options.initConfig ?? {}),
    ...(options.container ? { container: options.container } : {})
  };

  const configJson = JSON.stringify(initConfig);
  const guard = buildRouteGuardScript({
    routeInclude: dedupeSortedRoutes(options.routeInclude),
    routeExclude: dedupeSortedRoutes(options.routeExclude),
    routeMatchMode: options.routeMatchMode ?? DEFAULT_ROUTE_MATCH_MODE
  });

  if (!guard) {
    return `import { createSitelenLayerPlugin } from 'sitelen-layer-plugin';\ncreateSitelenLayerPlugin(${configJson}).init();`;
  }

  return `import { createSitelenLayerPlugin } from 'sitelen-layer-plugin';\n${guard}  createSitelenLayerPlugin(${configJson}).init();\n}\n`;
}

export function sitelenLayerVitePlugin(options: SitelenLayerVitePluginOptions = {}): Plugin {
  const normalized: Required<SitelenLayerVitePluginOptions> = {
    autoImportStyle: options.autoImportStyle ?? true,
    autoInit: options.autoInit ?? false,
    container: options.container ?? '',
    initConfig: options.initConfig ?? {},
    styleHref: options.styleHref ?? DEFAULT_STYLE_HREF,
    scriptBody: options.scriptBody ?? '',
    injectInto: options.injectInto ?? 'head',
    routeInclude: dedupeSortedRoutes(options.routeInclude),
    routeExclude: dedupeSortedRoutes(options.routeExclude),
    routeMatchMode: options.routeMatchMode ?? DEFAULT_ROUTE_MATCH_MODE
  };

  return {
    name: 'sitelen-layer-plugin',
    apply: 'build',
    transformIndexHtml: (html: string): { html: string; tags: HtmlTagDescriptor[] } => {
      const tags: HtmlTagDescriptor[] = [];

      if (normalized.autoImportStyle) {
        tags.push({
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: normalized.styleHref
          },
          injectTo: 'head'
        });
      }

      if (normalized.autoInit) {
        const body = normalized.scriptBody || createInitCode(normalized);
        tags.push({
          tag: 'script',
          attrs: {
            type: 'module'
          },
          children: body,
          injectTo: normalized.injectInto
        });
      }

      return { html, tags };
    }
  };
}

export default sitelenLayerVitePlugin;
