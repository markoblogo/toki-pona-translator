import type { Action } from 'svelte/action';
import type { SitelenLayerPluginConfig } from './types';
export interface SitelenLayerActionOptions extends SitelenLayerPluginConfig {
    autoInit?: boolean;
    enabled?: boolean;
}
export type SitelenLayerActionReturn = {
    update(config: SitelenLayerActionOptions): void;
    destroy: () => void;
};
export declare const sitelenLayerAction: Action<HTMLElement, SitelenLayerActionOptions>;
export default sitelenLayerAction;
