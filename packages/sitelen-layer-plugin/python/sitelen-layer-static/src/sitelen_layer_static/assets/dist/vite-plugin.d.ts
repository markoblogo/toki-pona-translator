import type { Plugin } from 'vite';
import type { SitelenLayerPluginConfig } from './types';
type RouteMatchMode = 'contains' | 'startsWith' | 'exact' | 'regex';
export interface SitelenLayerVitePluginOptions {
    autoImportStyle?: boolean;
    autoInit?: boolean;
    container?: string;
    initConfig?: SitelenLayerPluginConfig;
    styleHref?: string;
    scriptBody?: string;
    injectInto?: 'head' | 'body';
    routeInclude?: string[];
    routeExclude?: string[];
    routeMatchMode?: RouteMatchMode;
}
export declare function sitelenLayerVitePlugin(options?: SitelenLayerVitePluginOptions): Plugin;
export default sitelenLayerVitePlugin;
