export type RouteMatchMode = 'contains' | 'startsWith' | 'exact' | 'regex';

export interface SitelenLayerWebpackPluginOptions {
  autoInjectStyles?: boolean;
  autoInit?: boolean;
  styleHref?: string;
  initConfig?: Record<string, unknown>;
  scriptBody?: string;
  routeInclude?: string[];
  routeExclude?: string[];
  routeMatchMode?: RouteMatchMode;
}

type SitelenLayerWebpackPluginNormalizedOptions = Omit<SitelenLayerWebpackPluginOptions, 'styleHref'> & {
  styleHref: string;
};

const STYLE_ENTRY = 'sitelen-layer-plugin/styles.css';
const DEFAULT_ROUTE_MATCH_MODE: RouteMatchMode = 'contains';

function dedupeSortedRoutes(routes?: string[]): string[] {
  const unique = new Set((routes ?? []).filter((route) => typeof route === 'string' && route.length > 0));
  return [...unique].sort();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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

  return `\nfunction __slpShouldRun(route) {\n  const include = ${include};\n  const exclude = ${exclude};\n  const mode = ${mode};\n\n  function match(value, pattern) {\n    if (!pattern) {\n      return false;\n    }\n\n    if (mode === 'exact') {\n      return value === pattern;\n    }\n\n    if (mode === 'startsWith') {\n      return value.startsWith(pattern);\n    }\n\n    if (mode === 'regex') {\n      try {\n        const match = String(pattern).match(/^\/(.*)\/(.*)$/);\n        const expression = match ? match[1] : String(pattern);\n        const flags = match ? match[2] : 'i';\n        return new RegExp(expression, flags).test(value);\n      } catch (_err) {\n        return false;\n      }\n    }\n\n    return value.includes(pattern);\n  }\n\n  const hasInclude = include.length > 0;\n  const hasExclude = exclude.length > 0;\n  const normalizedRoute = String(route || '').toLowerCase();\n\n  if (hasInclude && !include.some((rule) => match(normalizedRoute, String(rule).toLowerCase()))) {\n    return false;\n  }\n\n  if (hasExclude && exclude.some((rule) => match(normalizedRoute, String(rule).toLowerCase()))) {\n    return false;\n  }\n\n  return true;\n}\n`;
}

function normalizeEntry(entry: unknown): unknown {
  if (typeof entry === 'string') {
    return [STYLE_ENTRY, entry];
  }

  if (Array.isArray(entry)) {
    if (!entry.includes(STYLE_ENTRY)) {
      entry.unshift(STYLE_ENTRY);
    }
    return entry;
  }

  if (entry && typeof entry === 'object') {
    const objectEntry = entry as Record<string, unknown>;
    Object.entries(objectEntry).forEach(([entryName, value]) => {
      if (typeof value === 'string') {
        objectEntry[entryName] = [STYLE_ENTRY, value];
      } else if (Array.isArray(value)) {
        if (!value.includes(STYLE_ENTRY)) {
          value.unshift(STYLE_ENTRY);
        }
      } else {
        normalizeEntry(value);
      }
    });
  }

  return entry;
}

function createInlineInitScript(options: SitelenLayerWebpackPluginOptions): string {
  if (options.scriptBody && options.scriptBody.length > 0) {
    return options.scriptBody;
  }

  const payload = JSON.stringify({
    ...(options.initConfig ?? {})
  });
  const guard = buildRouteGuardScript({
    routeInclude: options.routeInclude ?? [],
    routeExclude: options.routeExclude ?? [],
    routeMatchMode: options.routeMatchMode ?? DEFAULT_ROUTE_MATCH_MODE
  });

  if (!guard) {
    return `;(function() {\n  if (typeof window === 'undefined') return;\n  import('sitelen-layer-plugin').then(({ createSitelenLayerPlugin }) => {\n    createSitelenLayerPlugin(${payload}).init();\n  });\n})();`;
  }

  return `;(function() {\n  if (typeof window === 'undefined') return;\n  ${guard}\n  if (!__slpShouldRun((window.location.pathname + window.location.search + window.location.hash).toLowerCase())) {\n    return;\n  }\n  import('sitelen-layer-plugin').then(({ createSitelenLayerPlugin }) => {\n    createSitelenLayerPlugin(${payload}).init();\n  });\n})();`;
}

export class SitelenLayerWebpackPlugin {
  private readonly options: SitelenLayerWebpackPluginNormalizedOptions;

  constructor(options: SitelenLayerWebpackPluginOptions = {}) {
    this.options = {
      autoInjectStyles: options.autoInjectStyles ?? true,
      autoInit: options.autoInit ?? false,
      styleHref: options.styleHref ?? STYLE_ENTRY,
      initConfig: options.initConfig ?? {},
      scriptBody: options.scriptBody,
      routeInclude: dedupeSortedRoutes(options.routeInclude),
      routeExclude: dedupeSortedRoutes(options.routeExclude),
      routeMatchMode: options.routeMatchMode ?? DEFAULT_ROUTE_MATCH_MODE
    };
  }

  apply(compiler: any): void {
    if (!compiler || !compiler.options || typeof compiler.options !== 'object') {
      return;
    }

    if (this.options.autoInjectStyles) {
      compiler.options.entry = normalizeEntry(compiler.options.entry);
    }

    if (!this.options.autoInit) {
      return;
    }

    const inlineScript = createInlineInitScript(this.options);
    const styleTag = `<link rel="stylesheet" href="${this.options.styleHref}" data-sitelen-layer-autoinject-style="true">`;
    const scriptTag = `<script type="module" data-sitelen-layer-autoinit="true" data-sitelen-layer-autoinit-source="webpack">${inlineScript}</script>`;
    const marker = /(<\!doctype html>[\s\S]*?<\/head>)/i;
    const escapedStyleHref = escapeRegExp(this.options.styleHref);
    const styleLinkPattern = new RegExp(`<link[^>]+href=[\"']${escapedStyleHref}[\"'][^>]*>`, 'i');

    const ensureStyleInjected = (html: string): string => {
      if (!this.options.autoInjectStyles) {
        return html;
      }

      if (styleLinkPattern.test(html) || html.includes('data-sitelen-layer-autoinject-style="true"')) {
        return html;
      }

      if (this.options.styleHref === STYLE_ENTRY && marker.test(html)) {
        return html.replace(marker, `$1${styleTag}`);
      }

      if (/<\/head>/i.test(html)) {
        return html.replace(/<\/head>/i, `${styleTag}</head>`);
      }

      if (/<\/body>/i.test(html)) {
        return html.replace(/<\/body>/i, `${styleTag}</body>`);
      }

      return html;
    };

    const ensureScriptInjected = (html: string): string => {
      if (html.includes('data-sitelen-layer-autoinit="true"')) {
        return html;
      }

      return html.replace(/(<\/body>)/i, `${scriptTag}$1`);
    };

    const attach = (compilation: any, hookName: string): void => {
      const hook = compilation.hooks[hookName];
      if (!hook) {
        return;
      }

      const inject = (html: string): string => {
        const withStyle = ensureStyleInjected(html);
        return ensureScriptInjected(withStyle);
      };

      if (typeof hook.tapAsync === 'function') {
        hook.tapAsync('SitelenLayerWebpackPlugin', (data: { html: string }, cb: (err: Error | null, result?: unknown) => void) => {
          cb(null, {
            ...data,
            html: inject(data.html)
          });
        });
        return;
      }

      hook.tap('SitelenLayerWebpackPlugin', (data: { html: string }) => {
        data.html = inject(data.html);
        return data;
      });
    };

    compiler.hooks.thisCompilation?.tap('SitelenLayerWebpackPlugin', (compilation: any) => {
      attach(compilation, 'htmlWebpackPluginBeforeEmit');
      attach(compilation, 'htmlWebpackPluginBeforeHtmlProcessing');
      attach(compilation, 'htmlWebpackPluginAfterHtmlProcessing');
    });
  }
}

export default SitelenLayerWebpackPlugin;
