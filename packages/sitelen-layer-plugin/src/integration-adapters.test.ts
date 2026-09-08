import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { sitelenLayerVitePlugin } from './vite-plugin';
import { SitelenLayerWebpackPlugin } from './webpack-plugin';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

describe('integration smoke: route guards', () => {
  type TapAsyncCallback = (
    data: { html: string },
    cb: (err: Error | null, result?: { html: string }) => void
  ) => void;

  type TapCallback = (data: { html: string }) => void;

  it('adds allow/deny route guards in Vite auto-init script', () => {
    const { tags } = sitelenLayerVitePlugin({
      autoInit: true,
      autoImportStyle: false,
      routeInclude: ['/tp', '/toki-pona'],
      routeExclude: ['/admin'],
      routeMatchMode: 'contains',
      initConfig: { container: '#app' }
    }).transformIndexHtml('<!doctype html><html><body></body></html>');

    const script = tags.find((tag) => tag.tag === 'script');
    expect(script?.children).toContain('__slpShouldRun');
    expect(script?.children).toContain('/tp');
    expect(script?.children).toContain('/admin');
    expect(script?.children).toContain('contains');
  });

  it('does not add route guard when include/exclude are not set', () => {
    const { tags } = sitelenLayerVitePlugin({
      autoInit: true,
      autoImportStyle: false,
      initConfig: { container: '#app' }
    }).transformIndexHtml('<!doctype html><html><body></body></html>');

    const script = tags.find((tag) => tag.tag === 'script');
    expect(script?.children).toContain('createSitelenLayerPlugin');
    expect(script?.children).not.toContain('__slpShouldRun');
  });

  it('deduplicates webpack injected assets and keeps route guard code', async () => {
    const callbacks: Array<TapAsyncCallback | TapCallback> = [];

    const plugin = new SitelenLayerWebpackPlugin({
      autoInit: true,
      autoInjectStyles: true,
      routeInclude: ['/tp', '/toki-pona'],
      routeExclude: ['/admin'],
      routeMatchMode: 'contains',
      styleHref: 'sitelen-layer-plugin/styles.css',
      initConfig: { container: '#app' }
    });

    const asyncHook = {
      tapAsync: (_name: string, cb: TapAsyncCallback) => {
        callbacks.push(cb);
      }
    };

    const syncHook = {
      tap: (_name: string, cb: TapCallback) => {
        callbacks.push(cb);
      }
    };
    const compilation = {
      hooks: {
        htmlWebpackPluginBeforeEmit: asyncHook,
        htmlWebpackPluginBeforeHtmlProcessing: syncHook,
        htmlWebpackPluginAfterHtmlProcessing: syncHook
      }
    };

    const compiler = {
      options: {},
      hooks: {
        thisCompilation: {
          tap: (_name: string, cb: (compilation: typeof compilation) => void) => {
            cb(compilation);
          }
        }
      }
    };

    plugin.apply(compiler as any);

    const asyncInjection = callbacks.find((cb): cb is TapAsyncCallback => cb.length >= 2);
    if (!asyncInjection) {
      throw new Error('Expected async webpack HTML transform callback');
    }

    const fixture = '<!doctype html><html><head><title>demo</title></head><body><h1>demo</h1></body></html>';
    let transformed = fixture;

    await new Promise<void>((resolve) => {
      asyncInjection(
        { html: fixture },
        (_err: Error | null, result?: { html: string }) => {
          transformed = result?.html || fixture;
          resolve();
        }
      );
    });

    expect(transformed).toContain('__slpShouldRun');
    expect(transformed).toContain('data-sitelen-layer-autoinject-style="true"');
    expect(transformed).toContain('data-sitelen-layer-autoinit-source="webpack"');
    expect(transformed.match(/data-sitelen-layer-autoinject-style="true"/g)?.length).toBe(1);
    expect(transformed.match(/data-sitelen-layer-autoinit-source="webpack"/g)?.length).toBe(1);

    await new Promise<void>((resolve) => {
      asyncInjection(
        { html: transformed },
        (_err: Error | null, result?: { html: string }) => {
          transformed = result?.html || transformed;
          resolve();
        }
      );
    });

    expect(transformed.match(/data-sitelen-layer-autoinject-style="true"/g)?.length).toBe(1);
    expect(transformed.match(/data-sitelen-layer-autoinit-source="webpack"/g)?.length).toBe(1);
  });
});

describe('integration smoke: browser-extension PoC content contract', () => {
  it('contains CSP-safe bootstrap checks and duplicate-init guard', async () => {
    const content = await readFile(resolve(repoRoot, 'adapters/browser-extension/content.js'), 'utf8');
    expect(content).toContain('chrome.runtime.sendMessage({ type: \'GET_ENABLED\' }');
    expect(content).toContain('chrome.runtime.getURL(\'sitelen-layer-plugin.bundle.js\')');
    expect(content).toContain('GLOBAL_PLUGIN_KEY = \'__sitelenLayerPlugin__\'');
    expect(content).toContain('getCurrentRoute()');
    expect(content).toContain('window.location.pathname');
    expect(content).toContain('window.location.search');
    expect(content).toContain('window.location.hash');
    expect(content).not.toContain('document.createElement(\'script\')');
    expect(content).toContain('__sitelenLayerPlugin__');
    expect(content).toContain('chrome.runtime.lastError');
  });
});
