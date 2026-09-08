import { useEffect, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';
import { createSitelenLayerPlugin } from './index';
import type { SitelenLayerPluginConfig } from './types';
import type { SitelenLayerPlugin } from './plugin';

export interface UseSitelenLayerPluginOptions {
  autoInit?: boolean;
  enabled?: boolean;
}

function serializeConfig(config: SitelenLayerPluginConfig): string {
  const safeStringify = (value: unknown): unknown => {
    if (value === null || value === undefined) {
      return value;
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
    return JSON.stringify(config, (_key, value) => {
      const normalized = safeStringify(value);
      if (normalized && typeof normalized === 'object' && !Array.isArray(normalized) && !(normalized instanceof Date)) {
        return normalized;
      }

      return normalized;
    });
  } catch (error) {
    // no reason to fail hook wiring on non-serializable values; fall back to shape-only key
    return String(Object.keys(config).sort().join(','));
  }
}

export function useSitelenLayerPlugin(
  config: SitelenLayerPluginConfig = {},
  options: UseSitelenLayerPluginOptions = {}
): SitelenLayerPlugin | null {
  const pluginRef = useRef<SitelenLayerPlugin | null>(null);
  const enabled = options.enabled ?? true;
  const autoInit = options.autoInit ?? true;
  const configSignature = useMemo(() => serializeConfig(config), [config]);

  useEffect(() => {
    if (!enabled || !autoInit || typeof window === 'undefined') {
      return undefined;
    }

    const plugin = createSitelenLayerPlugin(config);
    pluginRef.current = plugin;
    plugin.init();

    return () => {
      plugin.destroy();
      pluginRef.current = null;
    };
  }, [configSignature, enabled, autoInit]);

  return pluginRef.current;
}

export interface SitelenLayerProviderProps {
  config?: SitelenLayerPluginConfig;
  enabled?: boolean;
  autoInit?: boolean;
  children?: ReactNode;
}

export function SitelenLayerProvider({
  children,
  config,
  enabled = true,
  autoInit = true
}: SitelenLayerProviderProps): ReactNode {
  useSitelenLayerPlugin(config ?? {}, { enabled, autoInit });
  return children ?? null;
}

export default { useSitelenLayerPlugin, SitelenLayerProvider };
