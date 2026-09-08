import type { ReactNode } from 'react';
import type { SitelenLayerPluginConfig } from './types';
export interface SitelenLayerNextProviderProps {
    children?: ReactNode;
    config?: SitelenLayerPluginConfig;
    enabled?: boolean;
    autoInit?: boolean;
}
declare function SitelenLayerNextProviderInner({ children, config, enabled, autoInit }: SitelenLayerNextProviderProps): ReactNode;
export declare const SitelenLayerNextProvider: import("react").MemoExoticComponent<typeof SitelenLayerNextProviderInner>;
export interface SitelenLayerNextHeaderMountProps extends SitelenLayerNextProviderProps {
    headerSelector: string;
}
export declare const SitelenLayerNextHeaderMount: import("react").NamedExoticComponent<SitelenLayerNextHeaderMountProps>;
declare const _default: {
    SitelenLayerNextProvider: import("react").MemoExoticComponent<typeof SitelenLayerNextProviderInner>;
    SitelenLayerNextHeaderMount: import("react").NamedExoticComponent<SitelenLayerNextHeaderMountProps>;
};
export default _default;
