import type { Action } from 'svelte/action';
import { createSitelenLayerPlugin } from './index';
import type { SitelenLayerPluginConfig } from './types';
import type { SitelenLayerPlugin } from './plugin';

export interface SitelenLayerActionOptions extends SitelenLayerPluginConfig {
  autoInit?: boolean;
  enabled?: boolean;
}

export type SitelenLayerActionReturn = {
  update(config: SitelenLayerActionOptions): void;
  destroy: () => void;
};

function serializeConfig(config: unknown): string {
  const safe = (value: unknown): unknown => {
    if (value === undefined) {
      return '__undefined__';
    }

    if (value === null) {
      return '__null__';
    }

    if (typeof value === 'function') {
      return '__function__';
    }

    if (typeof Element !== 'undefined' && value instanceof Element) {
      return `element:${value.tagName.toLowerCase()}#${value.id || 'no-id'}`;
    }

    return value;
  };

  try {
    return JSON.stringify(config, (_key, value) => safe(value));
  } catch {
    return '';
  }
}

export const sitelenLayerAction: Action<HTMLElement, SitelenLayerActionOptions> = (
  node: HTMLElement,
  initialOptions: SitelenLayerActionOptions = {}
) => {
  let plugin: SitelenLayerPlugin | null = null;
  let signature = '';

  const start = (options: SitelenLayerActionOptions = {}): void => {
    const autoInit = options.autoInit ?? true;
    if (!autoInit || options.enabled === false || typeof window === 'undefined') {
      return;
    }

    plugin?.destroy();
    plugin = createSitelenLayerPlugin({
      ...options,
      container: options.container ?? node
    });
    plugin.init();
  };

  const destroy = (): void => {
    plugin?.destroy();
    plugin = null;
    signature = '';
  };

  const sync = (options: SitelenLayerActionOptions = {}): void => {
    const nextSignature = serializeConfig(options);
    if (signature === nextSignature) {
      return;
    }

    destroy();
    start(options);
    signature = nextSignature;
  };

  sync(initialOptions);

  return {
    update(config = {}) {
      sync(config);
    },
    destroy
  };
};

export default sitelenLayerAction;
