import type { ReactNode } from 'react';
import type { SitelenLayerPluginConfig } from './types';
import type { SitelenLayerPlugin } from './plugin';
export interface UseSitelenLayerPluginOptions {
    autoInit?: boolean;
    enabled?: boolean;
}
export declare function useSitelenLayerPlugin(config?: SitelenLayerPluginConfig, options?: UseSitelenLayerPluginOptions): SitelenLayerPlugin | null;
export interface SitelenLayerProviderProps {
    config?: SitelenLayerPluginConfig;
    enabled?: boolean;
    autoInit?: boolean;
    children?: ReactNode;
}
export declare function SitelenLayerProvider({ children, config, enabled, autoInit }: SitelenLayerProviderProps): ReactNode;
declare const _default: {
    useSitelenLayerPlugin: typeof useSitelenLayerPlugin;
    SitelenLayerProvider: typeof SitelenLayerProvider;
};
export default _default;
