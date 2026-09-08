import type { ObjectDirective, Ref } from 'vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { createSitelenLayerPlugin } from './index';
import type { SitelenLayerPluginConfig } from './types';

interface SitelenLayerLifecycle {
  destroy(): void;
}

export type SitelenLayerPluginRef = Ref<SitelenLayerLifecycle | null>;

const STORAGE_KEY = '__sitelenLayerPlugin';
const DIRECTIVE_STATE_KEY = '__sitelenLayerPluginDirectiveState';

interface DirectiveState {
  signature: string;
  plugin: SitelenLayerLifecycle | null;
}

type DirectiveElement = Element & { [key: string]: unknown };

interface BindableDirectiveConfig extends SitelenLayerPluginConfig {
  autoStart?: boolean;
  enabled?: boolean;
}

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

function readState(el: DirectiveElement): DirectiveState | undefined {
  return el[DIRECTIVE_STATE_KEY] as DirectiveState | undefined;
}

function writeState(el: DirectiveElement, state: DirectiveState): void {
  el[DIRECTIVE_STATE_KEY] = state;
}

function deleteState(el: DirectiveElement): void {
  delete el[DIRECTIVE_STATE_KEY];
}

function resolveDirectiveConfig(
  baseConfig: SitelenLayerPluginConfig,
  bindingValue: BindableDirectiveConfig | undefined,
  el: Element
): BindableDirectiveConfig {
  const value = (bindingValue ?? {}) as BindableDirectiveConfig;
  return {
    ...baseConfig,
    ...value,
    container: value.container ?? el,
    storageKey: value.storageKey ?? `${STORAGE_KEY}:${el.tagName.toLowerCase()}`
  };
}

function buildDirectiveSignature(config: BindableDirectiveConfig): string {
  return serializeConfig(config);
}

function stopDirectivePlugin(el: DirectiveElement): void {
  const state = readState(el);
  if (!state) {
    return;
  }

  state.plugin?.destroy();
  deleteState(el);
}

export function useSitelenLayerPlugin(config: SitelenLayerPluginConfig = {}): SitelenLayerPluginRef {
  const pluginRef = ref<SitelenLayerLifecycle | null>(null);

  onMounted(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const plugin = createSitelenLayerPlugin(config);
    pluginRef.value = plugin;
    plugin.init();
  });

  onBeforeUnmount(() => {
    pluginRef.value?.destroy();
    pluginRef.value = null;
  });

  return pluginRef;
}

export interface SitelenLayerDirectiveConfig extends BindableDirectiveConfig {
  autoStart?: boolean;
}

function createDirectiveHandler(baseConfig: SitelenLayerPluginConfig = {}): ObjectDirective<Element, SitelenLayerDirectiveConfig> {
  return {
    mounted(el, binding) {
      if (typeof window === 'undefined') {
        return;
      }

      const target = el as DirectiveElement;
      const config = resolveDirectiveConfig(baseConfig, binding.value, target);
      if (config.autoStart === false || config.enabled === false) {
        return;
      }

      const plugin = createSitelenLayerPlugin(config);
      plugin.init();
      writeState(target, {
        plugin,
        signature: buildDirectiveSignature(config)
      });
    },
    updated(el, binding) {
      if (typeof window === 'undefined') {
        return;
      }

      const target = el as DirectiveElement;
      const currentState = readState(target);
      const config = resolveDirectiveConfig(baseConfig, binding.value, target);

      const nextSignature = buildDirectiveSignature(config);
      if (binding.value?.autoStart === false || binding.value?.enabled === false) {
        stopDirectivePlugin(target);
        return;
      }

      if (currentState?.signature === nextSignature) {
        return;
      }

      stopDirectivePlugin(target);
      const plugin = createSitelenLayerPlugin(config);
      plugin.init();
      writeState(target, {
        plugin,
        signature: nextSignature
      });
    },
    beforeUnmount(el) {
      stopDirectivePlugin(el as DirectiveElement);
    },
    unmounted(el) {
      stopDirectivePlugin(el as DirectiveElement);
    }
  };
}

export function createSitelenLayerDirective(
  baseConfig: SitelenLayerPluginConfig = {}
): ObjectDirective<Element, SitelenLayerDirectiveConfig> {
  return createDirectiveHandler(baseConfig);
}

export const vSitelenLayer = createSitelenLayerDirective();

export default { useSitelenLayerPlugin, createSitelenLayerDirective, vSitelenLayer };
