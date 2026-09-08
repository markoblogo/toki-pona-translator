import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createSitelenLayerPlugin } from './index';

const sleep = async (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

describe('plugin dom integration', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    localStorage.clear();
  });

  it('shows toggle for toki pona dominant container and restores latin text', () => {
    document.body.innerHTML = `
      <div id="app">
        <p>toki pona li pona tawa mi. jan pona li toki pona.</p>
        <code>toki pona li lon code</code>
      </div>
    `;

    const plugin = createSitelenLayerPlugin({
      container: '#app',
      defaultLayer: 'sitelen-emoji',
      sitelenPona: { enabled: false }
    });

    plugin.init();

    const toggle = document.querySelector('[data-sitelen-layer-ui="toggle"]');
    expect(toggle).not.toBeNull();

    const paragraph = document.querySelector('#app p') as HTMLParagraphElement;
    const code = document.querySelector('#app code') as HTMLElement;

    expect(paragraph.textContent).toContain('👤');
    expect(code.textContent).toBe('toki pona li lon code');

    const latinButton = document.querySelector('button[data-layer="latin"]') as HTMLButtonElement;
    latinButton.click();

    expect(paragraph.textContent).toContain('toki pona');

    plugin.destroy();
  });

  it('hides toggle on non-eligible container', () => {
    document.body.innerHTML = `
      <div id="app">
        <p>This text is mostly English and should fail dominance threshold.</p>
      </div>
    `;

    const plugin = createSitelenLayerPlugin({
      container: '#app',
      requireDominantTokiPona: true,
      sitelenPona: { enabled: false }
    });

    plugin.init();

    const toggle = document.querySelector('[data-sitelen-layer-ui="toggle"]');
    expect(toggle).toBeNull();

    plugin.destroy();
  });

  it('respects data-sitelen-layer-ignore and scope', () => {
    document.body.innerHTML = `
      <div id="app" data-sitelen-layer-scope>
        <p id="tp">toki pona li pona</p>
        <p id="ignored" data-sitelen-layer-ignore>toki pona li pona</p>
      </div>
    `;

    const plugin = createSitelenLayerPlugin({
      container: '#app',
      defaultLayer: 'sitelen-emoji',
      sitelenPona: { enabled: false }
    });

    plugin.init();

    expect(document.querySelector('#tp')?.textContent).toContain('🗣️');
    expect(document.querySelector('#ignored')?.textContent).toBe('toki pona li pona');

    plugin.destroy();
  });

  it('updates dynamic content in observer mode without self-loop', async () => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback): number => {
      cb(0);
      return 1;
    });

    document.body.innerHTML = `
      <div id="app">
        <p>toki pona li pona tawa mi</p>
      </div>
    `;

    const plugin = createSitelenLayerPlugin({
      container: '#app',
      defaultLayer: 'sitelen-emoji',
      sitelenPona: { enabled: false },
      mutationObserver: {
        enabled: true,
        debounceMs: 10,
        incremental: true
      }
    });

    plugin.init();

    const extra = document.createElement('p');
    extra.textContent = 'jan pona li toki';
    document.querySelector('#app')?.appendChild(extra);

    await new Promise((resolve) => setTimeout(resolve, 30));

    expect(extra.textContent).toContain('👤');
    expect(plugin.getDiagnostics().observerStats.mutationsObserved).toBeGreaterThan(0);

    plugin.destroy();
  });

  it('mounts toggle inline when toggleMount is found', () => {
    document.body.innerHTML = `
      <header><div id="toggle-mount"></div></header>
      <div id="app">
        <p>toki pona li pona tawa mi. jan pona li toki pona.</p>
      </div>
    `;

    const plugin = createSitelenLayerPlugin({
      container: '#app',
      toggleMount: '#toggle-mount',
      toggleMode: 'auto',
      sitelenPona: { enabled: false }
    });

    plugin.init();

    const mount = document.querySelector('#toggle-mount') as HTMLElement;
    const toggle = mount.querySelector('[data-sitelen-layer-ui="toggle"]') as HTMLElement;
    expect(toggle).not.toBeNull();
    expect(toggle.dataset.slpToggleMode).toBe('inline');
    expect(plugin.getDiagnostics().toggleMountMode).toBe('inline');
    expect(plugin.getDiagnostics().toggleSize).toBe('md');

    plugin.destroy();
  });

  it('uses predictable default toggle labels', () => {
    document.body.innerHTML = `
      <div id="app">
        <p>toki pona li pona tawa mi. jan pona li toki pona.</p>
      </div>
    `;

    const plugin = createSitelenLayerPlugin({
      container: '#app',
      sitelenPona: { enabled: true, renderStrategy: 'transform' }
    });

    plugin.init();

    const latinBtn = document.querySelector('button[data-layer="latin"]') as HTMLButtonElement;
    const spBtn = document.querySelector('button[data-layer="sitelen-pona"]') as HTMLButtonElement;
    const emojiBtn = document.querySelector('button[data-layer="sitelen-emoji"]') as HTMLButtonElement;
    expect(latinBtn.textContent).toBe('TP');
    expect(spBtn.textContent).toBe('SP');
    expect(emojiBtn.textContent).toBe('🙂');

    plugin.destroy();
  });

  it('falls back to floating mode when inline mount is missing', () => {
    document.body.innerHTML = `
      <div id="app">
        <p>toki pona li pona tawa mi. jan pona li toki pona.</p>
      </div>
    `;

    const plugin = createSitelenLayerPlugin({
      container: '#app',
      toggleMount: '#missing',
      toggleMode: 'inline',
      sitelenPona: { enabled: false }
    });

    plugin.init();

    const toggle = document.querySelector('[data-sitelen-layer-ui="toggle"]') as HTMLElement;
    expect(toggle.dataset.slpToggleMode).toBe('floating');
    expect(plugin.getDiagnostics().toggleMountMode).toBe('floating');

    plugin.destroy();
  });

  it('supports custom toggle labels and layer-specific emoji excludes', () => {
    document.body.innerHTML = `
      <div id="app">
        <header><p id="nav">toki pona li pona</p></header>
        <main><p id="main">jan pona li toki xyz</p></main>
      </div>
    `;

    const plugin = createSitelenLayerPlugin({
      container: '#app',
      defaultLayer: 'sitelen-emoji',
      sitelenPona: { enabled: false },
      toggleLabels: {
        latin: 'TP',
        'sitelen-emoji': { text: '😄', ariaLabel: 'Sitelen emoji mode' }
      },
      emojiExcludeSelectors: ['header']
    });

    plugin.init();

    const latinBtn = document.querySelector('button[data-layer="latin"]') as HTMLButtonElement;
    const emojiBtn = document.querySelector('button[data-layer="sitelen-emoji"]') as HTMLButtonElement;
    expect(latinBtn.textContent).toBe('TP');
    expect(emojiBtn.textContent).toBe('😄');
    expect(emojiBtn.getAttribute('aria-label')).toBe('Sitelen emoji mode');

    const nav = document.querySelector('#nav') as HTMLElement;
    const main = document.querySelector('#main') as HTMLElement;
    expect(nav.textContent).toBe('toki pona li pona');
    expect(main.textContent).toContain('👤');

    const diagnostics = plugin.getDiagnostics();
    expect(diagnostics.emojiReplacementCount).toBeGreaterThan(0);
    expect(diagnostics.emojiCoverageRatio).toBeGreaterThan(0);
    expect(diagnostics.emojiTopUnmapped.length).toBeGreaterThan(0);

    plugin.destroy();
  });

  it('applies sitelen pona transform layer and restores latin', () => {
    document.body.innerHTML = `
      <div id="app">
        <p>toki pona li pona tawa mi. jan pona li toki pona xyz.</p>
      </div>
    `;

    const plugin = createSitelenLayerPlugin({
      container: '#app',
      defaultLayer: 'sitelen-pona',
      sitelenPona: { enabled: true, renderStrategy: 'transform' }
    });

    plugin.init();

    const paragraph = document.querySelector('#app p') as HTMLParagraphElement;
    expect(paragraph.textContent).toContain('⟐');

    const diagnostics = plugin.getDiagnostics();
    expect(diagnostics.sitelenPonaRenderMode).toBe('transform');
    expect(diagnostics.sitelenPonaReplacementCount).toBeGreaterThan(0);
    expect(diagnostics.sitelenPonaWordTokenCount).toBeGreaterThan(0);
    expect(diagnostics.sitelenPonaCoverageRatio).not.toBeNull();
    expect(diagnostics.sitelenPonaTopUnmapped.length).toBeGreaterThan(0);

    const latinButton = document.querySelector('button[data-layer="latin"]') as HTMLButtonElement;
    latinButton.click();
    expect(paragraph.textContent).toContain('toki pona');

    plugin.destroy();
  });

  it('uses ligature-font strategy without rewriting text nodes', () => {
    document.body.innerHTML = `
      <div id="app">
        <p>toki pona li pona. lipu ni li pona tawa jan ale.</p>
      </div>
    `;

    const plugin = createSitelenLayerPlugin({
      container: '#app',
      defaultLayer: 'sitelen-pona',
      sitelenPona: { enabled: true, renderStrategy: 'ligature-font' }
    });

    plugin.init();

    const app = document.querySelector('#app') as HTMLElement;
    const paragraph = document.querySelector('#app p') as HTMLParagraphElement;
    const diagnostics = plugin.getDiagnostics();

    expect(paragraph.textContent).toBe('toki pona li pona. lipu ni li pona tawa jan ale.');
    expect(app.classList.contains('slp-layer--sitelen-pona')).toBe(true);
    expect(diagnostics.sitelenPonaRenderMode).toBe('ligature-font');
    expect(diagnostics.sitelenPonaTextRewrite).toBe(false);
    expect(diagnostics.sitelenPonaReplacementCount).toBe(0);
    expect(diagnostics.sitelenPonaCoverageRatio).toBeNull();
    expect(diagnostics.sitelenPonaTopUnmapped).toEqual([]);

    plugin.destroy();
  });

  it('restores latin text when switching from emoji to ligature-font sitelen pona', () => {
    document.body.innerHTML = `
      <div id="app">
        <p>toki pona li pona. lipu ni li pona tawa jan ale.</p>
      </div>
    `;

    const plugin = createSitelenLayerPlugin({
      container: '#app',
      defaultLayer: 'sitelen-emoji',
      sitelenPona: { enabled: true, renderStrategy: 'ligature-font' }
    });

    plugin.init();

    const app = document.querySelector('#app') as HTMLElement;
    const paragraph = document.querySelector('#app p') as HTMLParagraphElement;
    expect(paragraph.textContent).toContain('🗣️');

    const spButton = document.querySelector('button[data-layer="sitelen-pona"]') as HTMLButtonElement;
    spButton.click();

    expect(paragraph.textContent).toBe('toki pona li pona. lipu ni li pona tawa jan ale.');
    expect(app.classList.contains('slp-layer--sitelen-pona')).toBe(true);
    expect(app.classList.contains('slp-layer--sitelen-emoji')).toBe(false);
    expect(plugin.getDiagnostics().sitelenPonaTextRewrite).toBe(false);

    plugin.destroy();
  });

  it('switches from ligature-font sitelen pona to emoji transform', () => {
    document.body.innerHTML = `
      <div id="app">
        <p>toki pona li pona. lipu ni li pona tawa jan ale.</p>
      </div>
    `;

    const plugin = createSitelenLayerPlugin({
      container: '#app',
      defaultLayer: 'sitelen-pona',
      sitelenPona: { enabled: true, renderStrategy: 'ligature-font' }
    });

    plugin.init();

    const app = document.querySelector('#app') as HTMLElement;
    const paragraph = document.querySelector('#app p') as HTMLParagraphElement;
    expect(paragraph.textContent).toBe('toki pona li pona. lipu ni li pona tawa jan ale.');

    const emojiButton = document.querySelector('button[data-layer="sitelen-emoji"]') as HTMLButtonElement;
    emojiButton.click();

    expect(paragraph.textContent).toContain('🗣️');
    expect(app.classList.contains('slp-layer--sitelen-pona')).toBe(false);
    expect(app.classList.contains('slp-layer--sitelen-emoji')).toBe(true);

    plugin.destroy();
  });

  it('keeps sitelen pona transform eligible after observer diagnostics refresh', async () => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback): number => {
      cb(0);
      return 1;
    });

    document.body.innerHTML = `
      <div id="app">
        <p>toki pona li pona tawa mi. jan pona li toki pona. sona pi pilin awen li pona.</p>
      </div>
    `;

    const plugin = createSitelenLayerPlugin({
      container: '#app',
      defaultLayer: 'sitelen-pona',
      sitelenPona: { enabled: true, renderStrategy: 'transform' },
      mutationObserver: {
        enabled: true,
        debounceMs: 10,
        incremental: true
      }
    });

    plugin.init();

    await new Promise((resolve) => setTimeout(resolve, 30));

    const paragraph = document.querySelector('#app p') as HTMLParagraphElement;
    const toggle = document.querySelector('[data-sitelen-layer-ui="toggle"]');
    const diagnostics = plugin.getDiagnostics();

    expect(toggle).not.toBeNull();
    expect(paragraph.textContent).toContain('⟐');
    expect(paragraph.textContent).toContain('♥');
    expect(diagnostics.eligible).toBe(true);
    expect(diagnostics.activeLayer).toBe('sitelen-pona');
    expect(diagnostics.sitelenPonaCoverageRatio).toBe(1);

    plugin.destroy();
  });

  it('keeps font-only path stable and reports no transform coverage', () => {
    document.body.innerHTML = `
      <div id="app">
        <p>toki pona li pona tawa mi. jan pona li toki pona.</p>
      </div>
    `;

    const plugin = createSitelenLayerPlugin({
      container: '#app',
      sitelenPona: { enabled: true, renderStrategy: 'font-only' }
    });

    plugin.init();
    const diagnostics = plugin.getDiagnostics();
    expect(diagnostics.sitelenPonaRenderMode).toBe('font-only');
    expect(diagnostics.sitelenPonaTextRewrite).toBe(false);
    expect(diagnostics.sitelenPonaCoverageRatio).toBeNull();
    expect(diagnostics.sitelenPonaReplacementCount).toBe(0);
    expect(diagnostics.sitelenPonaTopUnmapped).toEqual([]);
    plugin.destroy();
  });

  it('applies header-friendly toggle size class', () => {
    document.body.innerHTML = `
      <header><div id="toggle-mount"></div></header>
      <div id="app">
        <p>toki pona li pona tawa mi. jan pona li toki pona.</p>
      </div>
    `;

    const plugin = createSitelenLayerPlugin({
      container: '#app',
      toggleMount: '#toggle-mount',
      toggleMode: 'auto',
      toggleSize: 'lg'
    });

    plugin.init();

    const toggle = document.querySelector('[data-sitelen-layer-ui="toggle"]') as HTMLElement;
    expect(toggle.classList.contains('slp-toggle--size-lg')).toBe(true);
    expect(plugin.getDiagnostics().toggleSize).toBe('lg');
    plugin.destroy();
  });

  it('exposes layer usage and unmapped snapshots', () => {
    document.body.innerHTML = `
      <div id="app">
        <p>toki pona li pona e jan pona li moku e kili lon tomo xyz xyz</p>
      </div>
    `;

    const plugin = createSitelenLayerPlugin({
      container: '#app',
      defaultLayer: 'sitelen-emoji',
      sitelenPona: { enabled: false }
    });

    plugin.init();

    const firstSnapshot = plugin.getLayerUsageSnapshot();
    const firstUnmapped = plugin.getUnmappedSnapshot({
      layer: 'sitelen-emoji',
      limit: 5
    });

    expect(firstSnapshot.activeLayer).toBe('sitelen-emoji');
    expect(firstSnapshot.countsByLayer['sitelen-emoji']).toBeGreaterThan(0);
    expect(firstUnmapped.layer).toBe('sitelen-emoji');
    expect(firstUnmapped.tokens.length).toBeGreaterThan(0);

    const latinButton = document.querySelector('button[data-layer="latin"]') as HTMLButtonElement;
    latinButton.click();

    const secondSnapshot = plugin.getLayerUsageSnapshot();
    expect(secondSnapshot.activeLayer).toBe('latin');
    expect(secondSnapshot.countsByLayer.latin).toBeGreaterThan(0);
    expect(secondSnapshot.totalSwitches).toBeGreaterThanOrEqual(firstSnapshot.totalSwitches);
    expect(typeof plugin.getConfig()).toBe('object');

    plugin.destroy();
  });

  it('supports windowed layer usage snapshots', () => {
    document.body.innerHTML = `
      <div id="app">
        <p>toki pona li pona e jan pona li moku e kili lon tomo xyz</p>
      </div>
    `;

    const plugin = createSitelenLayerPlugin({
      container: '#app',
      defaultLayer: 'sitelen-emoji',
      sitelenPona: { enabled: false }
    });

    plugin.init();

    const base = plugin.getLayerUsageSnapshot();
    const sinceFuture = new Date(Date.now() + 60_000).toISOString();
    const futureWindow = plugin.getLayerUsageSnapshot({ since: sinceFuture });
    expect(base.totalSwitches).toBeGreaterThan(0);
    expect(futureWindow.totalSwitches).toBe(0);

    const latinButton = document.querySelector('button[data-layer="latin"]') as HTMLButtonElement;
    latinButton.click();

    const lastOne = plugin.getLayerUsageSnapshot({ maxEntries: 1 });
    expect(lastOne.totalSwitches).toBe(1);
    expect(lastOne.countsByLayer.latin).toBe(1);

    const shortWindow = plugin.getLayerUsageSnapshot({ timeWindowMs: 10000 });
    expect(shortWindow.totalSwitches).toBeGreaterThanOrEqual(base.totalSwitches);
    expect(shortWindow.windowSeconds).toBeGreaterThanOrEqual(10);

    plugin.destroy();
  });

  it('keeps telemetry off by default and does not emit beacons', async () => {
    const fetchSpy = vi.spyOn(window, 'fetch').mockResolvedValue(
      new Response('{}', { status: 200, headers: { 'content-type': 'application/json' } })
    );

    document.body.innerHTML = `
      <div id="app">
        <p>toki pona li pona e jan pona li moku e kili lon tomo xyz</p>
      </div>
    `;

    const plugin = createSitelenLayerPlugin({
      container: '#app',
      defaultLayer: 'sitelen-emoji',
      sitelenPona: { enabled: false },
      telemetry: false
    });

    plugin.init();

    const latinButton = document.querySelector('button[data-layer="latin"]') as HTMLButtonElement;
    latinButton.click();
    await sleep(30);

    expect(fetchSpy).not.toHaveBeenCalled();
    fetchSpy.mockRestore();
    plugin.destroy();
  });

  it('stores telemetry while offline and retries on online event', async () => {
    const fetchSpy = vi.spyOn(window, 'fetch');
    const attempts: Array<Record<string, string>> = [];
    fetchSpy.mockImplementation(() => {
      attempts.push({});
      if (attempts.length === 1) {
        return Promise.reject(new Error('offline'));
      }
      return Promise.resolve(new Response('{}', { status: 200 }));
    });

    Object.defineProperty(navigator, 'onLine', {
      value: false,
      configurable: true
    });

    document.body.innerHTML = `
      <div id="app">
        <p>toki pona li pona e jan pona li moku e kili lon tomo xyz</p>
      </div>
    `;

    const plugin = createSitelenLayerPlugin({
      container: '#app',
      defaultLayer: 'sitelen-emoji',
      sitelenPona: { enabled: false },
      telemetry: {
        enabled: true,
        beaconUrl: '/telemetry',
        sampleRate: 1,
        batchSize: 10,
        flushIntervalMs: 10,
        retryBackoffMs: 5,
        maxRetries: 1
      }
    });

    plugin.init();
    await sleep(25);

    const queued = JSON.parse(localStorage.getItem('sitelen-layer-plugin:telemetry-queue') ?? '[]');
    expect(Array.isArray(queued)).toBe(true);
    expect(queued.length).toBeGreaterThan(0);
    const ids = queued.map((entry: { id?: string }) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);

    Object.defineProperty(navigator, 'onLine', {
      value: true,
      configurable: true
    });
    window.dispatchEvent(new Event('online'));
    await sleep(40);

    expect(fetchSpy).toHaveBeenCalled();
    expect(attempts.length).toBeGreaterThan(1);
    fetchSpy.mockRestore();
    plugin.destroy();
  });
});
