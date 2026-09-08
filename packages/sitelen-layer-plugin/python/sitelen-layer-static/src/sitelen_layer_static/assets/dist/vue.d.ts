import type { ObjectDirective, Ref } from 'vue';
import type { SitelenLayerPluginConfig } from './types';
interface SitelenLayerLifecycle {
    destroy(): void;
}
export type SitelenLayerPluginRef = Ref<SitelenLayerLifecycle | null>;
interface BindableDirectiveConfig extends SitelenLayerPluginConfig {
    autoStart?: boolean;
    enabled?: boolean;
}
export declare function useSitelenLayerPlugin(config?: SitelenLayerPluginConfig): SitelenLayerPluginRef;
export interface SitelenLayerDirectiveConfig extends BindableDirectiveConfig {
    autoStart?: boolean;
}
export declare function createSitelenLayerDirective(baseConfig?: SitelenLayerPluginConfig): ObjectDirective<Element, SitelenLayerDirectiveConfig>;
export declare const vSitelenLayer: ObjectDirective<Element, SitelenLayerDirectiveConfig, string, any>;
declare const _default: {
    useSitelenLayerPlugin: typeof useSitelenLayerPlugin;
    createSitelenLayerDirective: typeof createSitelenLayerDirective;
    vSitelenLayer: ObjectDirective<Element, SitelenLayerDirectiveConfig, string, any>;
};
export default _default;
