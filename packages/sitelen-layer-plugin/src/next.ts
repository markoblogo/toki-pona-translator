'use client';

import type { ReactNode } from 'react';
import { memo } from 'react';
import { useSitelenLayerPlugin } from './react';
import type { SitelenLayerPluginConfig } from './types';

const isBrowser = typeof window !== 'undefined';

export interface SitelenLayerNextProviderProps {
  children?: ReactNode;
  config?: SitelenLayerPluginConfig;
  enabled?: boolean;
  autoInit?: boolean;
}

function SitelenLayerNextProviderInner({
  children,
  config,
  enabled = true,
  autoInit = true
}: SitelenLayerNextProviderProps): ReactNode {
  if (!isBrowser) {
    return children ?? null;
  }

  useSitelenLayerPlugin(config ?? {}, { enabled, autoInit });
  return children ?? null;
}

export const SitelenLayerNextProvider = memo(SitelenLayerNextProviderInner);

export interface SitelenLayerNextHeaderMountProps extends SitelenLayerNextProviderProps {
  headerSelector: string;
}

export const SitelenLayerNextHeaderMount = memo(function SitelenLayerNextHeaderMount({
  children,
  config,
  enabled,
  autoInit,
  headerSelector
}: SitelenLayerNextHeaderMountProps): ReactNode {
  if (!isBrowser) {
    return children ?? null;
  }

  return SitelenLayerNextProviderInner({
    config: {
      ...config,
      toggleMount: config?.toggleMount ?? headerSelector,
      toggleMode: config?.toggleMode ?? 'inline'
    },
    enabled,
    autoInit,
    children
  });
});

export default {
  SitelenLayerNextProvider,
  SitelenLayerNextHeaderMount
};
