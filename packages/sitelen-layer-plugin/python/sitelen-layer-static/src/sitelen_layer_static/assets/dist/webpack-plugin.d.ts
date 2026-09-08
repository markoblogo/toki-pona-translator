export type RouteMatchMode = 'contains' | 'startsWith' | 'exact' | 'regex';
export interface SitelenLayerWebpackPluginOptions {
    autoInjectStyles?: boolean;
    autoInit?: boolean;
    styleHref?: string;
    initConfig?: Record<string, unknown>;
    scriptBody?: string;
    routeInclude?: string[];
    routeExclude?: string[];
    routeMatchMode?: RouteMatchMode;
}
export declare class SitelenLayerWebpackPlugin {
    private readonly options;
    constructor(options?: SitelenLayerWebpackPluginOptions);
    apply(compiler: any): void;
}
export default SitelenLayerWebpackPlugin;
